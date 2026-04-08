package api

import (
	"context"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"slices"
	"strings"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

var frequencyNumberPattern = regexp.MustCompile(`(\d+)`)

func runMigrations(ctx context.Context, db *sql.DB, migrationSQL string) error {
	_, err := db.ExecContext(ctx, migrationSQL)
	return err
}

func authenticatePassword(hash, candidate string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(candidate)) == nil
}

func nullIfEmpty(value string) interface{} {
	if strings.TrimSpace(value) == "" {
		return nil
	}
	return value
}

func scanAccount(scanner interface {
	Scan(dest ...any) error
}) (accountRow, error) {
	var row accountRow
	err := scanner.Scan(
		&row.ID,
		&row.Role,
		&row.Email,
		&row.PasswordHash,
		&row.DisplayName,
		&row.FirstName,
		&row.LastName,
		&row.LicenseNumber,
		&row.PatientCode,
		&row.AvatarPath,
		&row.ThemeMode,
		&row.AccentColor,
		&row.ConsentAccepted,
		&row.PatientStage,
		&row.CreatedAt,
	)
	return row, err
}

func (s *Server) accountByEmail(ctx context.Context, email string) (accountRow, error) {
	row := s.db.QueryRowContext(ctx, `
		SELECT id, role, email, password_hash, display_name, first_name, last_name, license_number,
		       COALESCE(patient_code, ''), avatar_path, theme_mode, accent_color,
		       consent_accepted, patient_stage, created_at
		FROM accounts
		WHERE lower(email) = lower($1)
	`, email)
	return scanAccount(row)
}

func (s *Server) accountByID(ctx context.Context, accountID string) (accountRow, error) {
	row := s.db.QueryRowContext(ctx, `
		SELECT id, role, email, password_hash, display_name, first_name, last_name, license_number,
		       COALESCE(patient_code, ''), avatar_path, theme_mode, accent_color,
		       consent_accepted, patient_stage, created_at
		FROM accounts
		WHERE id = $1
	`, accountID)
	return scanAccount(row)
}

func (s *Server) accountByToken(ctx context.Context, token string) (accountRow, error) {
	row := s.db.QueryRowContext(ctx, `
		SELECT a.id, a.role, a.email, a.password_hash, a.display_name, a.first_name, a.last_name, a.license_number,
		       COALESCE(a.patient_code, ''), a.avatar_path, a.theme_mode, a.accent_color,
		       a.consent_accepted, a.patient_stage, a.created_at
		FROM sessions AS sess
		JOIN accounts AS a ON a.id = sess.user_id
		WHERE sess.token = $1 AND sess.expires_at > NOW()
	`, token)
	return scanAccount(row)
}

func (s *Server) createSession(ctx context.Context, account accountRow) (AuthSession, error) {
	token := uuid.NewString()
	_, err := s.db.ExecContext(ctx, `
		INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3)
	`, token, account.ID, time.Now().Add(30*24*time.Hour))
	if err != nil {
		return AuthSession{}, err
	}

	return AuthSession{
		Token:           token,
		UserID:          account.ID,
		Role:            account.Role,
		DisplayName:     account.DisplayName,
		Email:           account.Email,
		AvatarURL:       s.assetURL(account.AvatarPath),
		ThemeMode:       account.ThemeMode,
		AccentColor:     account.AccentColor,
		ConsentAccepted: account.ConsentAccepted,
		PatientStage:    account.PatientStage,
	}, nil
}

func (s *Server) deleteSession(ctx context.Context, token string) error {
	_, err := s.db.ExecContext(ctx, `DELETE FROM sessions WHERE token = $1`, token)
	return err
}

func (s *Server) registerAccount(ctx context.Context, role UserRole, payload AuthFormPayload) (AuthSession, error) {
	if _, err := s.accountByEmail(ctx, payload.Email); err == nil {
		return AuthSession{}, fmt.Errorf("account already exists")
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)
	if err != nil {
		return AuthSession{}, err
	}

	firstName := strings.TrimSpace(payload.FirstName)
	lastName := strings.TrimSpace(payload.LastName)
	displayName := strings.TrimSpace(strings.Join([]string{firstName, lastName}, " "))
	if displayName == "" {
		displayName = payload.Email
	}

	account := accountRow{
		ID:            fmt.Sprintf("%s-%s", role, uuid.NewString()),
		Role:          role,
		Email:         payload.Email,
		PasswordHash:  string(passwordHash),
		DisplayName:   displayName,
		FirstName:     firstName,
		LastName:      lastName,
		LicenseNumber: payload.LicenseNumber,
		ThemeMode:     ThemeBlueMedical,
		AccentColor:   "#2563eb",
		PatientStage:  StageEmpty,
	}

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return AuthSession{}, err
	}
	defer tx.Rollback()

	if role == RolePatient {
		code, err := nextPatientCode(ctx, tx)
		if err != nil {
			return AuthSession{}, err
		}
		account.PatientCode = code
	}

	if err := insertAccount(ctx, tx, account); err != nil {
		return AuthSession{}, err
	}

	if role == RolePatient {
		progressJSON, _ := json.Marshal([]ProgressPoint{
			{Day: "Mon", Compliance: 82, Risk: 8},
			{Day: "Tue", Compliance: 84, Risk: 8},
			{Day: "Wed", Compliance: 85, Risk: 7},
			{Day: "Thu", Compliance: 83, Risk: 8},
			{Day: "Fri", Compliance: 86, Risk: 7},
			{Day: "Sat", Compliance: 87, Risk: 7},
			{Day: "Sun", Compliance: 88, Risk: 7},
		})
		tasksJSON, _ := json.Marshal([]PatientTask{
			{ID: "1", Title: "Review instructions", Time: "09:00", Completed: false, Category: "nutrition"},
			{ID: "2", Title: "Hydration check", Time: "All day", Completed: false, Category: "nutrition"},
		})
		sleepJSON, _ := json.Marshal(buildSleepEntries([]float64{7.0, 6.9, 7.1, 7.0, 7.2, 6.8, 7.0}))
		_, err = tx.ExecContext(ctx, `
			INSERT INTO patients (
				patient_code, account_id, email, name, procedure, doctor_name, specialty, compliance, risk, risk_score,
				notes, next_appointment, surgery_duration, hospital_stay, last_consultation, streak, days_until_surgery,
				progress, tasks, sleep_entries, surgery_decision
			) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
		`,
			account.PatientCode, account.ID, account.Email, displayName, "Pending assignment", "Dr. Andi Setiawan",
			"General Surgery", 88, "Low", 7, "Awaiting doctor assignment and first care plan.",
			"No appointment yet", "TBD", "TBD", "No prior consultation", 0, 30,
			string(progressJSON), string(tasksJSON), string(sleepJSON), DecisionNone,
		)
		if err != nil {
			return AuthSession{}, err
		}
	}

	if err := tx.Commit(); err != nil {
		return AuthSession{}, err
	}

	return s.createSession(ctx, account)
}

func nextPatientCode(ctx context.Context, tx *sql.Tx) (string, error) {
	rows, err := tx.QueryContext(ctx, `SELECT patient_code FROM patients ORDER BY patient_code`)
	if err != nil {
		return "", err
	}
	defer rows.Close()

	maxCode := 0
	for rows.Next() {
		var code string
		if err := rows.Scan(&code); err != nil {
			return "", err
		}
		var numeric int
		fmt.Sscanf(strings.TrimPrefix(code, "p"), "%d", &numeric)
		if numeric > maxCode {
			maxCode = numeric
		}
	}
	return fmt.Sprintf("p%d", maxCode+1), rows.Err()
}

func (s *Server) userProfile(account accountRow) UserProfile {
	return UserProfile{
		ID:            account.ID,
		Role:          account.Role,
		Email:         account.Email,
		DisplayName:   account.DisplayName,
		FirstName:     account.FirstName,
		LastName:      account.LastName,
		LicenseNumber: account.LicenseNumber,
		AvatarURL:     s.assetURL(account.AvatarPath),
		ThemeMode:     account.ThemeMode,
		AccentColor:   account.AccentColor,
		PatientCode:   account.PatientCode,
	}
}

func (s *Server) updateProfile(ctx context.Context, account accountRow, payload UpdateProfilePayload) (accountRow, error) {
	displayName := strings.TrimSpace(payload.DisplayName)
	if displayName == "" {
		displayName = account.DisplayName
	}
	firstName := strings.TrimSpace(payload.FirstName)
	lastName := strings.TrimSpace(payload.LastName)
	if firstName == "" {
		firstName = account.FirstName
	}
	if lastName == "" {
		lastName = account.LastName
	}
	theme := payload.ThemeMode
	if theme == "" {
		theme = account.ThemeMode
	}
	accent := strings.TrimSpace(payload.AccentColor)
	if accent == "" {
		accent = account.AccentColor
	}

	_, err := s.db.ExecContext(ctx, `
		UPDATE accounts
		SET display_name = $2, first_name = $3, last_name = $4, theme_mode = $5, accent_color = $6, updated_at = NOW()
		WHERE id = $1
	`, account.ID, displayName, firstName, lastName, theme, accent)
	if err != nil {
		return accountRow{}, err
	}

	if account.PatientCode != "" {
		if _, err := s.db.ExecContext(ctx, `
			UPDATE patients SET name = $2, updated_at = NOW() WHERE patient_code = $1
		`, account.PatientCode, displayName); err != nil {
			return accountRow{}, err
		}
	}

	return s.accountByID(ctx, account.ID)
}

func (s *Server) updatePatientStage(ctx context.Context, account accountRow, stage PatientJourneyStage) error {
	if account.Role != RolePatient {
		return fmt.Errorf("only patients have flow stages")
	}
	_, err := s.db.ExecContext(ctx, `UPDATE accounts SET patient_stage = $2, updated_at = NOW() WHERE id = $1`, account.ID, stage)
	return err
}

func (s *Server) acceptPatientConsent(ctx context.Context, account accountRow) error {
	if account.Role != RolePatient {
		return fmt.Errorf("only patients can accept consent")
	}
	_, err := s.db.ExecContext(ctx, `
		UPDATE accounts
		SET consent_accepted = TRUE, patient_stage = $2, updated_at = NOW()
		WHERE id = $1
	`, account.ID, StageDashboard)
	return err
}

func decodeDataURL(data string) ([]byte, error) {
	parts := strings.SplitN(data, ",", 2)
	if len(parts) != 2 {
		return nil, errors.New("invalid data url")
	}
	return base64.StdEncoding.DecodeString(parts[1])
}

func extensionForMime(mimeType, fallbackName string) string {
	switch mimeType {
	case "image/png":
		return ".png"
	case "image/jpeg":
		return ".jpg"
	case "application/pdf":
		return ".pdf"
	case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
		return ".docx"
	}
	extension := filepath.Ext(fallbackName)
	if extension == "" {
		return ".bin"
	}
	return extension
}

func (s *Server) saveAsset(folder string, payload UploadAssetPayload) (string, error) {
	if payload.Data == "" {
		return "", nil
	}
	content, err := decodeDataURL(payload.Data)
	if err != nil {
		return "", err
	}
	filename := fmt.Sprintf("%s%s", uuid.NewString(), extensionForMime(payload.MimeType, payload.Name))
	targetDir := filepath.Join(s.storageDir, folder)
	if err := os.MkdirAll(targetDir, 0o755); err != nil {
		return "", err
	}
	path := filepath.Join(targetDir, filename)
	if err := os.WriteFile(path, content, 0o644); err != nil {
		return "", err
	}
	return fmt.Sprintf("/assets/%s/%s", folder, filename), nil
}

func (s *Server) updateAvatar(ctx context.Context, account accountRow, payload UploadAssetPayload) (accountRow, error) {
	path, err := s.saveAsset("avatars", payload)
	if err != nil {
		return accountRow{}, err
	}
	if _, err := s.db.ExecContext(ctx, `UPDATE accounts SET avatar_path = $2, updated_at = NOW() WHERE id = $1`, account.ID, path); err != nil {
		return accountRow{}, err
	}
	return s.accountByID(ctx, account.ID)
}

type patientRow struct {
	PatientCode      string
	AccountID        string
	DoctorAccountID  string
	Email            string
	Name             string
	Procedure        string
	DoctorName       string
	Specialty        string
	Compliance       int
	Risk             RiskLevel
	RiskScore        int
	Notes            string
	NextAppointment  string
	SurgeryDuration  string
	HospitalStay     string
	LastConsultation string
	Streak           int
	DaysUntilSurgery int
	ProgressJSON     []byte
	TasksJSON        []byte
	SleepEntriesJSON []byte
	SurgeryDecision  SurgeryDecision
	AvatarPath       string
}

func (s *Server) patientByCode(ctx context.Context, patientCode string) (patientRow, error) {
	var row patientRow
	err := s.db.QueryRowContext(ctx, `
		SELECT p.patient_code, COALESCE(p.account_id, ''), COALESCE(p.doctor_account_id, ''), p.email, p.name,
		       p.procedure, p.doctor_name, p.specialty, p.compliance, p.risk, p.risk_score, p.notes,
		       p.next_appointment, p.surgery_duration, p.hospital_stay, p.last_consultation, p.streak,
		       p.days_until_surgery, p.progress, p.tasks, p.sleep_entries, p.surgery_decision,
		       COALESCE(a.avatar_path, '')
		FROM patients AS p
		LEFT JOIN accounts AS a ON a.id = p.account_id
		WHERE p.patient_code = $1
	`, patientCode).Scan(
		&row.PatientCode, &row.AccountID, &row.DoctorAccountID, &row.Email, &row.Name, &row.Procedure, &row.DoctorName,
		&row.Specialty, &row.Compliance, &row.Risk, &row.RiskScore, &row.Notes, &row.NextAppointment,
		&row.SurgeryDuration, &row.HospitalStay, &row.LastConsultation, &row.Streak, &row.DaysUntilSurgery,
		&row.ProgressJSON, &row.TasksJSON, &row.SleepEntriesJSON, &row.SurgeryDecision, &row.AvatarPath,
	)
	return row, err
}

type carePlanRow struct {
	ID              string
	PatientCode     string
	InviteID        string
	Procedure       string
	SurgeryDate     time.Time
	SurgeryDocument []byte
	MedicationsJSON []byte
	DietJSON        []byte
	InviteStatus    PendingInviteStatus
	AcceptedAt      sql.NullTime
	CreatedAt       time.Time
}

func (s *Server) carePlansForPatient(ctx context.Context, patientCode string) ([]carePlanRow, error) {
	rows, err := s.db.QueryContext(ctx, `
		SELECT id, patient_code, invite_id, procedure, surgery_date, COALESCE(surgery_document, '{}'::jsonb),
		       medications, diet, invite_status, accepted_at, created_at
		FROM care_plans
		WHERE patient_code = $1
		ORDER BY created_at DESC
	`, patientCode)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var plans []carePlanRow
	for rows.Next() {
		var row carePlanRow
		if err := rows.Scan(&row.ID, &row.PatientCode, &row.InviteID, &row.Procedure, &row.SurgeryDate, &row.SurgeryDocument, &row.MedicationsJSON, &row.DietJSON, &row.InviteStatus, &row.AcceptedAt, &row.CreatedAt); err != nil {
			return nil, err
		}
		plans = append(plans, row)
	}
	return plans, rows.Err()
}

func selectPlan(plans []carePlanRow, preferred PendingInviteStatus) *carePlanRow {
	for index := range plans {
		if plans[index].InviteStatus == preferred {
			return &plans[index]
		}
	}
	return nil
}

func decodeJSON[T any](raw []byte, fallback T) T {
	if len(raw) == 0 {
		return fallback
	}
	value := fallback
	if err := json.Unmarshal(raw, &value); err != nil {
		return fallback
	}
	return value
}

func derivedDocument(raw []byte, assetResolver func(string) string) *SurgeryPlanDocument {
	if len(raw) == 0 || string(raw) == "{}" {
		return nil
	}
	value := decodeJSON(raw, SurgeryPlanDocument{})
	if value.ID == "" && value.Name == "" && value.URL == "" {
		return nil
	}
	value.URL = assetResolver(value.URL)
	return &value
}

func (s *Server) effectivePlans(ctx context.Context, patientCode string) (*carePlanRow, *carePlanRow, error) {
	plans, err := s.carePlansForPatient(ctx, patientCode)
	if err != nil {
		return nil, nil, err
	}
	return selectPlan(plans, InviteActive), selectPlan(plans, InvitePending), nil
}

func (s *Server) doctorVisiblePlan(ctx context.Context, patientCode string) (*carePlanRow, error) {
	active, pending, err := s.effectivePlans(ctx, patientCode)
	if err != nil {
		return nil, err
	}
	if pending != nil {
		return pending, nil
	}
	return active, nil
}

func (s *Server) patientVisiblePlan(ctx context.Context, patientCode string) (*carePlanRow, error) {
	active, pending, err := s.effectivePlans(ctx, patientCode)
	if err != nil {
		return nil, err
	}
	if active != nil {
		return active, nil
	}
	return pending, nil
}

func (s *Server) patientInvite(ctx context.Context, patientCode string) (*PatientInvite, error) {
	patient, err := s.patientByCode(ctx, patientCode)
	if err != nil {
		return nil, err
	}
	active, pending, err := s.effectivePlans(ctx, patientCode)
	if err != nil {
		return nil, err
	}
	var plan *carePlanRow
	if pending != nil {
		plan = pending
	} else {
		plan = active
	}
	if plan == nil {
		return nil, nil
	}
	return &PatientInvite{
		InviteID:         plan.InviteID,
		PatientID:        patient.PatientCode,
		Status:           plan.InviteStatus,
		DoctorName:       patient.DoctorName,
		Specialty:        patient.Specialty,
		Procedure:        plan.Procedure,
		SurgeryDate:      plan.SurgeryDate.Format("January 2, 2006"),
		HasPendingUpdate: pending != nil,
	}, nil
}

func (s *Server) acceptInvite(ctx context.Context, patientCode string) error {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if _, err := tx.ExecContext(ctx, `
		UPDATE care_plans SET invite_status = $2, updated_at = NOW()
		WHERE patient_code = $1 AND invite_status = $3
	`, patientCode, InviteArchived, InviteActive); err != nil {
		return err
	}

	result, err := tx.ExecContext(ctx, `
		UPDATE care_plans SET invite_status = $2, accepted_at = NOW(), updated_at = NOW()
		WHERE patient_code = $1 AND invite_status = $3
	`, patientCode, InviteActive, InvitePending)
	if err != nil {
		return err
	}
	rows, _ := result.RowsAffected()
	if rows == 0 {
		return sql.ErrNoRows
	}

	if _, err := tx.ExecContext(ctx, `
		UPDATE accounts SET patient_stage = $2, updated_at = NOW() WHERE patient_code = $1
	`, patientCode, StageSurgery); err != nil {
		return err
	}
	return tx.Commit()
}

func riskStatus(risk RiskLevel) string {
	switch risk {
	case "High":
		return "Needs Intervention"
	case "Medium":
		return "Warning"
	default:
		return "On Track"
	}
}

func previewText(value string) string {
	trimmed := strings.TrimSpace(value)
	if len(trimmed) <= 22 {
		return trimmed
	}
	return strings.TrimSpace(trimmed[:22]) + "..."
}

func parseFrequencyDuration(value string) time.Duration {
	match := frequencyNumberPattern.FindStringSubmatch(strings.ToLower(value))
	amount := 1
	if len(match) > 1 {
		fmt.Sscanf(match[1], "%d", &amount)
	}
	switch {
	case strings.Contains(strings.ToLower(value), "hour"):
		return time.Duration(amount) * time.Hour
	case strings.Contains(strings.ToLower(value), "week"):
		return time.Duration(amount*7) * 24 * time.Hour
	default:
		return time.Duration(amount) * 24 * time.Hour
	}
}

func derivedMedicationEvents(medications []MedicationPlan, rangeStart, rangeEnd time.Time) []CalendarEvent {
	var events []CalendarEvent
	for _, medication := range medications {
		nextDose, err := time.Parse(time.RFC3339, medication.Schedule.NextDoseAt)
		if err != nil {
			continue
		}
		interval := parseFrequencyDuration(medication.Schedule.Frequency)
		for occurrence := 0; occurrence < 120; occurrence += 1 {
			if nextDose.After(rangeEnd) {
				break
			}
			if !nextDose.Before(rangeStart) {
				events = append(events, CalendarEvent{
					ID:           fmt.Sprintf("%s-%d", medication.ID, occurrence),
					Date:         nextDose.Format("2006-01-02"),
					Type:         "medication",
					Title:        "Take " + medication.Name,
					Detail:       medication.Description,
					PreviewText:  previewText(medication.Name),
					StartAt:      nextDose.Format(time.RFC3339),
					AllDay:       false,
					MedicationID: medication.ID,
				})
			}
			nextDose = nextDose.Add(interval)
		}
	}
	return events
}

func surgeryEvent(plan *carePlanRow) CalendarEvent {
	startAt := time.Date(plan.SurgeryDate.Year(), plan.SurgeryDate.Month(), plan.SurgeryDate.Day(), 9, 0, 0, 0, time.UTC)
	return CalendarEvent{
		ID:          "surgery-" + plan.PatientCode,
		Date:        plan.SurgeryDate.Format("2006-01-02"),
		Type:        "surgery",
		Title:       plan.Procedure,
		Detail:      "Confirmed surgery date.",
		PreviewText: "Surgery",
		StartAt:     startAt.Format(time.RFC3339),
		AllDay:      true,
	}
}

func (s *Server) calendarEventRows(ctx context.Context, patientCode string) ([]CalendarEvent, error) {
	rows, err := s.db.QueryContext(ctx, `
		SELECT id, type, title, detail, start_at, end_at, all_day, medication_id, recurrence
		FROM calendar_events
		WHERE patient_code = $1
		ORDER BY start_at ASC
	`, patientCode)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []CalendarEvent
	for rows.Next() {
		var event CalendarEvent
		var startAt time.Time
		var endAt sql.NullTime
		var recurrenceRaw []byte
		if err := rows.Scan(&event.ID, &event.Type, &event.Title, &event.Detail, &startAt, &endAt, &event.AllDay, &event.MedicationID, &recurrenceRaw); err != nil {
			return nil, err
		}
		event.PreviewText = previewText(event.Title)
		event.StartAt = startAt.Format(time.RFC3339)
		event.Date = startAt.Format("2006-01-02")
		if endAt.Valid {
			event.EndAt = endAt.Time.Format(time.RFC3339)
		}
		if len(recurrenceRaw) > 0 {
			rule := decodeJSON(recurrenceRaw, RecurrenceRule{})
			if rule.Mode != "" {
				event.Recurrence = &rule
			}
		}
		events = append(events, event)
	}
	return events, rows.Err()
}

func mergedEvents(plan *carePlanRow, customEvents []CalendarEvent, rangeStart, rangeEnd time.Time) []CalendarEvent {
	events := make([]CalendarEvent, 0)
	if plan != nil {
		medications := decodeJSON(plan.MedicationsJSON, []MedicationPlan{})
		surgery := surgeryEvent(plan)
		surgeryTime, _ := time.Parse(time.RFC3339, surgery.StartAt)
		if !surgeryTime.Before(rangeStart) && !surgeryTime.After(rangeEnd) {
			events = append(events, surgery)
		}
		events = append(events, derivedMedicationEvents(medications, rangeStart, rangeEnd)...)
	}

	for _, base := range customEvents {
		startAt, err := time.Parse(time.RFC3339, base.StartAt)
		if err != nil {
			continue
		}
		var endAt *time.Time
		if base.EndAt != "" {
			value, err := time.Parse(time.RFC3339, base.EndAt)
			if err == nil {
				endAt = &value
			}
		}
		events = append(events, expandCalendarEvent(base, startAt, endAt, base.Recurrence, rangeStart, rangeEnd)...)
	}

	slices.SortFunc(events, func(left, right CalendarEvent) int {
		if left.Date == right.Date {
			return strings.Compare(left.Title, right.Title)
		}
		return strings.Compare(left.Date, right.Date)
	})
	return events
}

func (s *Server) patientProfile(ctx context.Context, patientCode string) (PatientProfile, error) {
	patient, err := s.patientByCode(ctx, patientCode)
	if err != nil {
		return PatientProfile{}, err
	}
	plan, err := s.patientVisiblePlan(ctx, patientCode)
	if err != nil {
		return PatientProfile{}, err
	}
	if plan == nil {
		return PatientProfile{
			ID:               patient.PatientCode,
			Name:             patient.Name,
			Email:            patient.Email,
			AvatarURL:        s.assetURL(patient.AvatarPath),
			Procedure:        patient.Procedure,
			Compliance:       patient.Compliance,
			Risk:             patient.Risk,
			RiskScore:        patient.RiskScore,
			Status:           riskStatus(patient.Risk),
			InviteStatus:     InviteActive,
			SurgeryDate:      "Not scheduled",
			DaysUntilSurgery: patient.DaysUntilSurgery,
			AttendingDoctor:  patient.DoctorName,
			Specialty:        patient.Specialty,
			HospitalStay:     patient.HospitalStay,
			SurgeryDuration:  patient.SurgeryDuration,
			NextAppointment:  patient.NextAppointment,
		}, nil
	}
	return PatientProfile{
		ID:               patient.PatientCode,
		Name:             patient.Name,
		Email:            patient.Email,
		AvatarURL:        s.assetURL(patient.AvatarPath),
		Procedure:        plan.Procedure,
		Compliance:       patient.Compliance,
		Risk:             patient.Risk,
		RiskScore:        patient.RiskScore,
		Status:           riskStatus(patient.Risk),
		InviteStatus:     plan.InviteStatus,
		SurgeryDate:      plan.SurgeryDate.Format("January 2, 2006"),
		DaysUntilSurgery: patient.DaysUntilSurgery,
		AttendingDoctor:  patient.DoctorName,
		Specialty:        patient.Specialty,
		HospitalStay:     patient.HospitalStay,
		SurgeryDuration:  patient.SurgeryDuration,
		NextAppointment:  patient.NextAppointment,
	}, nil
}

func (s *Server) patientTasks(ctx context.Context, patientCode string) ([]PatientTask, error) {
	patient, err := s.patientByCode(ctx, patientCode)
	if err != nil {
		return nil, err
	}
	return decodeJSON(patient.TasksJSON, []PatientTask{}), nil
}

func (s *Server) updateTask(ctx context.Context, patientCode, taskID string, completed bool) ([]PatientTask, error) {
	tasks, err := s.patientTasks(ctx, patientCode)
	if err != nil {
		return nil, err
	}
	for index := range tasks {
		if tasks[index].ID == taskID {
			tasks[index].Completed = completed
		}
	}
	raw, _ := json.Marshal(tasks)
	if _, err := s.db.ExecContext(ctx, `UPDATE patients SET tasks = $2, updated_at = NOW() WHERE patient_code = $1`, patientCode, string(raw)); err != nil {
		return nil, err
	}
	return tasks, nil
}

func (s *Server) patientProgress(ctx context.Context, patientCode string) ([]ProgressPoint, error) {
	patient, err := s.patientByCode(ctx, patientCode)
	if err != nil {
		return nil, err
	}
	return decodeJSON(patient.ProgressJSON, []ProgressPoint{}), nil
}

func (s *Server) patientMedications(ctx context.Context, patientCode string) ([]MedicationPlan, error) {
	plan, err := s.patientVisiblePlan(ctx, patientCode)
	if err != nil || plan == nil {
		return []MedicationPlan{}, err
	}
	return decodeJSON(plan.MedicationsJSON, []MedicationPlan{}), nil
}

func (s *Server) patientDiet(ctx context.Context, patientCode string) ([]DietItem, error) {
	plan, err := s.patientVisiblePlan(ctx, patientCode)
	if err != nil || plan == nil {
		return []DietItem{}, err
	}
	items := decodeJSON(plan.DietJSON, []DietItem{})
	slices.SortFunc(items, func(left, right DietItem) int {
		return dietOrder(left.Type) - dietOrder(right.Type)
	})
	return items, nil
}

func dietOrder(value DietType) int {
	switch value {
	case "mandatory":
		return 0
	case "recommended":
		return 1
	default:
		return 2
	}
}

func (s *Server) patientSleep(ctx context.Context, patientCode string) (SleepSummary, error) {
	patient, err := s.patientByCode(ctx, patientCode)
	if err != nil {
		return SleepSummary{}, err
	}
	entries := decodeJSON(patient.SleepEntriesJSON, []SleepEntry{})
	total := 0.0
	for _, entry := range entries {
		total += entry.Hours
	}
	average := 0.0
	if len(entries) > 0 {
		average = total / float64(len(entries))
	}
	return SleepSummary{
		TargetHours:  7,
		AverageHours: average,
		MeetsTarget:  average >= 7,
		Entries:      entries,
	}, nil
}

func calendarRangeForMonth(year, month int) (time.Time, time.Time) {
	start := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
	end := start.AddDate(0, 1, 0).Add(-time.Nanosecond)
	return start, end
}

func calendarRangeForYear(year int) (time.Time, time.Time) {
	start := time.Date(year, time.January, 1, 0, 0, 0, 0, time.UTC)
	end := time.Date(year, time.December, 31, 23, 59, 59, int(time.Second-time.Nanosecond), time.UTC)
	return start, end
}

func (s *Server) patientCalendar(ctx context.Context, patientCode string, year, month int) (CalendarViewData, error) {
	plan, err := s.patientVisiblePlan(ctx, patientCode)
	if err != nil {
		return CalendarViewData{}, err
	}
	custom, err := s.calendarEventRows(ctx, patientCode)
	if err != nil {
		return CalendarViewData{}, err
	}
	rangeStart, rangeEnd := calendarRangeForMonth(year, month)
	return CalendarViewData{
		Label:      rangeStart.Format("January 2006"),
		FocusMonth: month,
		Year:       year,
		Events:     mergedEvents(plan, custom, rangeStart, rangeEnd),
	}, nil
}

func (s *Server) doctorCalendar(ctx context.Context, patientCode string, year int) (CalendarViewData, error) {
	plan, err := s.doctorVisiblePlan(ctx, patientCode)
	if err != nil {
		return CalendarViewData{}, err
	}
	custom, err := s.calendarEventRows(ctx, patientCode)
	if err != nil {
		return CalendarViewData{}, err
	}
	rangeStart, rangeEnd := calendarRangeForYear(year)
	return CalendarViewData{
		Label:      fmt.Sprintf("%d", year),
		FocusMonth: int(time.Now().Month()),
		Year:       year,
		Events:     mergedEvents(plan, custom, rangeStart, rangeEnd),
	}, nil
}

func (s *Server) doctorDashboard(ctx context.Context, doctor accountRow) (DoctorDashboardData, error) {
	rows, err := s.db.QueryContext(ctx, `SELECT patient_code FROM patients WHERE doctor_account_id = $1 ORDER BY patient_code`, doctor.ID)
	if err != nil {
		return DoctorDashboardData{}, err
	}
	defer rows.Close()

	var patientCodes []string
	for rows.Next() {
		var code string
		if err := rows.Scan(&code); err != nil {
			return DoctorDashboardData{}, err
		}
		patientCodes = append(patientCodes, code)
	}

	colors := []string{"#2563eb", "#14b8a6", "#f59e0b", "#ef4444", "#8b5cf6", "#10b981"}
	patients := make([]DoctorPatientSummary, 0, len(patientCodes))
	series := make([]ComplianceSeries, 0, len(patientCodes))
	activeCount := 0
	needsIntervention := 0

	for index, patientCode := range patientCodes {
		patient, err := s.patientByCode(ctx, patientCode)
		if err != nil {
			return DoctorDashboardData{}, err
		}
		plan, err := s.doctorVisiblePlan(ctx, patientCode)
		if err != nil {
			return DoctorDashboardData{}, err
		}
		inviteStatus := InviteActive
		procedure := patient.Procedure
		if plan != nil {
			inviteStatus = plan.InviteStatus
			procedure = plan.Procedure
		}
		status := riskStatus(patient.Risk)
		if inviteStatus == InvitePending {
			status = "Pending Acceptance"
		}
		progress := decodeJSON(patient.ProgressJSON, []ProgressPoint{})
		trend := make([]int, 0, len(progress))
		labels := make([]string, 0, len(progress))
		values := make([]int, 0, len(progress))
		for _, point := range progress {
			trend = append(trend, point.Compliance)
			labels = append(labels, point.Day)
			values = append(values, point.Compliance)
		}
		patients = append(patients, DoctorPatientSummary{
			ID:           patient.PatientCode,
			Name:         patient.Name,
			Procedure:    procedure,
			Compliance:   patient.Compliance,
			Risk:         patient.Risk,
			Status:       status,
			InviteStatus: inviteStatus,
			AvatarURL:    s.assetURL(patient.AvatarPath),
			Trend:        trend,
		})
		series = append(series, ComplianceSeries{
			PatientID: patient.PatientCode,
			Name:      patient.Name,
			Color:     colors[index%len(colors)],
			Labels:    labels,
			Values:    values,
		})
		if inviteStatus == InviteActive {
			activeCount += 1
		}
		if patient.Risk == "High" {
			needsIntervention += 1
		}
	}

	return DoctorDashboardData{
		DoctorName:        doctor.DisplayName,
		Title:             "General Surgery",
		ActivePatients:    activeCount,
		NeedsIntervention: needsIntervention,
		Patients:          patients,
		ComplianceSeries:  series,
	}, nil
}

func (s *Server) doctorPatientDetail(ctx context.Context, patientCode string) (PatientDetail, error) {
	patient, err := s.patientByCode(ctx, patientCode)
	if err != nil {
		return PatientDetail{}, err
	}
	plan, err := s.doctorVisiblePlan(ctx, patientCode)
	if err != nil {
		return PatientDetail{}, err
	}
	if plan == nil {
		return PatientDetail{}, fmt.Errorf("patient has no care plan")
	}
	custom, err := s.calendarEventRows(ctx, patientCode)
	if err != nil {
		return PatientDetail{}, err
	}
	previewStart, previewEnd := calendarRangeForMonth(time.Now().Year(), int(time.Now().Month()))
	progress := decodeJSON(patient.ProgressJSON, []ProgressPoint{})
	tasks := decodeJSON(patient.TasksJSON, []PatientTask{})
	medications := decodeJSON(plan.MedicationsJSON, []MedicationPlan{})
	diet := decodeJSON(plan.DietJSON, []DietItem{})
	slices.SortFunc(diet, func(left, right DietItem) int { return dietOrder(left.Type) - dietOrder(right.Type) })
	status := riskStatus(patient.Risk)
	if plan.InviteStatus == InvitePending {
		status = "Pending Acceptance"
	}
	return PatientDetail{
		ID:              patient.PatientCode,
		Name:            patient.Name,
		Procedure:       plan.Procedure,
		Compliance:      patient.Compliance,
		Risk:            patient.Risk,
		RiskScore:       patient.RiskScore,
		Status:          status,
		InviteStatus:    plan.InviteStatus,
		AvatarURL:       s.assetURL(patient.AvatarPath),
		NextAppointment: patient.NextAppointment,
		Tasks:           tasks,
		Notes:           patient.Notes,
		SurgeryDate:     plan.SurgeryDate.Format("January 2, 2006"),
		SurgeryDocument: derivedDocument(plan.SurgeryDocument, s.assetURL),
		Medications:     medications,
		Diet:            diet,
		CalendarPreview: mergedEvents(plan, custom, previewStart, previewEnd),
		Progress:        progress,
		SurgeryDecision: patient.SurgeryDecision,
	}, nil
}

func (s *Server) lookupPatient(ctx context.Context, patientCode string) (PatientProfile, error) {
	patient, err := s.patientByCode(ctx, patientCode)
	if err != nil {
		return PatientProfile{}, err
	}
	return PatientProfile{
		ID:               patient.PatientCode,
		Name:             patient.Name,
		Email:            patient.Email,
		AvatarURL:        s.assetURL(patient.AvatarPath),
		Procedure:        patient.Procedure,
		Compliance:       patient.Compliance,
		Risk:             patient.Risk,
		RiskScore:        patient.RiskScore,
		Status:           riskStatus(patient.Risk),
		InviteStatus:     InviteActive,
		SurgeryDate:      "Not scheduled",
		DaysUntilSurgery: patient.DaysUntilSurgery,
		AttendingDoctor:  patient.DoctorName,
		Specialty:        patient.Specialty,
		HospitalStay:     patient.HospitalStay,
		SurgeryDuration:  patient.SurgeryDuration,
		NextAppointment:  patient.NextAppointment,
	}, nil
}

func (s *Server) createPendingCarePlan(ctx context.Context, draft CarePlanDraft) error {
	patient, err := s.patientByCode(ctx, draft.PatientID)
	if err != nil {
		return err
	}
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if _, err := tx.ExecContext(ctx, `
		UPDATE care_plans SET invite_status = $2, updated_at = NOW()
		WHERE patient_code = $1 AND invite_status = $3
	`, draft.PatientID, InviteArchived, InvitePending); err != nil {
		return err
	}

	medicationsJSON, _ := json.Marshal(draft.Medications)
	dietJSON, _ := json.Marshal(draft.Diet)
	var documentJSON interface{}
	if draft.SurgeryDocument != nil && draft.SurgeryDocument.Data != "" {
		path, err := s.saveAsset("documents", UploadAssetPayload{
			Name:     draft.SurgeryDocument.Name,
			MimeType: draft.SurgeryDocument.MimeType,
			Data:     draft.SurgeryDocument.Data,
		})
		if err != nil {
			return err
		}
		draft.SurgeryDocument.URL = path
		draft.SurgeryDocument.Data = ""
		draft.SurgeryDocument.ID = uuid.NewString()
		raw, _ := json.Marshal(draft.SurgeryDocument)
		documentJSON = string(raw)
	}

	_, err = tx.ExecContext(ctx, `
		INSERT INTO care_plans (
			id, patient_code, invite_id, procedure, surgery_date, surgery_document,
			medications, diet, invite_status
		) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
	`,
		uuid.NewString(), draft.PatientID, fmt.Sprintf("invite-%s-%d", draft.PatientID, time.Now().Unix()), patient.Procedure,
		draft.SurgeryDate, documentJSON, string(medicationsJSON), string(dietJSON), InvitePending,
	)
	if err != nil {
		return err
	}
	return tx.Commit()
}

func (s *Server) createCalendarEvent(ctx context.Context, patientCode, userID string, payload CalendarEventCreatePayload) error {
	var recurrenceJSON interface{}
	if payload.Recurrence != nil && payload.Recurrence.Mode != "" && payload.Recurrence.Mode != "does-not-repeat" {
		raw, _ := json.Marshal(payload.Recurrence)
		recurrenceJSON = string(raw)
	}
	_, err := s.db.ExecContext(ctx, `
		INSERT INTO calendar_events (
			id, patient_code, type, title, detail, start_at, end_at, all_day, medication_id, recurrence, created_by_user_id
		) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
	`,
		uuid.NewString(), patientCode, payload.Type, payload.Title, payload.Detail, payload.StartAt,
		nullIfEmpty(payload.EndAt), payload.AllDay, payload.MedicationID, recurrenceJSON, userID,
	)
	return err
}

func (s *Server) setSurgeryDecision(ctx context.Context, patientCode string, decision SurgeryDecision) error {
	if decision != DecisionProceed && decision != DecisionPostpone && decision != DecisionNone {
		return fmt.Errorf("invalid surgery decision")
	}
	_, err := s.db.ExecContext(ctx, `UPDATE patients SET surgery_decision = $2, updated_at = NOW() WHERE patient_code = $1`, patientCode, decision)
	return err
}
