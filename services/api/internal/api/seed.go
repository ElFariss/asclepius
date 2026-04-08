package api

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func seedIfNeeded(ctx context.Context, db *sql.DB) error {
	var count int
	if err := db.QueryRowContext(ctx, `SELECT COUNT(*) FROM accounts`).Scan(&count); err != nil {
		return err
	}
	if count > 0 {
		return nil
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	doctor := accountRow{
		ID:            "doctor-1",
		Role:          RoleDoctor,
		Email:         "dr.andi@hospital.com",
		PasswordHash:  string(passwordHash),
		DisplayName:   "Dr. Andi Setiawan",
		FirstName:     "Andi",
		LastName:      "Setiawan",
		LicenseNumber: "DOC-2026-001",
		ThemeMode:     ThemeBlueMedical,
		AccentColor:   "#2563eb",
		PatientStage:  StageDashboard,
	}

	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if err := insertAccount(ctx, tx, doctor); err != nil {
		return err
	}

	patientSeeds := []struct {
		Account          accountRow
		Name             string
		Procedure        string
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
		Progress         []ProgressPoint
		Tasks            []PatientTask
		Sleep            []SleepEntry
		Plan             *CarePlanDraft
		AcceptedAt       string
	}{
		{
			Account: accountRow{
				ID:           "patient-1",
				Role:         RolePatient,
				Email:        "patient@example.com",
				PasswordHash: string(passwordHash),
				DisplayName:  "Budi Santoso",
				FirstName:    "Budi",
				LastName:     "Santoso",
				ThemeMode:    ThemeBlueMedical,
				AccentColor:  "#2563eb",
				PatientCode:  "p1",
				PatientStage: StageEmpty,
			},
			Name:             "Budi Santoso",
			Procedure:        "Laparoscopic Cholecystectomy",
			Specialty:        "Digestive & Oncology Surgery",
			Compliance:       91,
			Risk:             "Low",
			RiskScore:        6,
			Notes:            "High compliance and good breathing routine. Continue daily nutritional checks.",
			NextAppointment:  "Tomorrow, 09:00 AM",
			SurgeryDuration:  "60 - 90 Minutes",
			HospitalStay:     "1 - 2 Days",
			LastConsultation: "Yesterday, 14:20",
			Streak:           5,
			DaysUntilSurgery: 12,
			Progress: []ProgressPoint{
				{Day: "Mon", Compliance: 85, Risk: 12},
				{Day: "Tue", Compliance: 90, Risk: 10},
				{Day: "Wed", Compliance: 75, Risk: 15},
				{Day: "Thu", Compliance: 95, Risk: 8},
				{Day: "Fri", Compliance: 100, Risk: 5},
				{Day: "Sat", Compliance: 92, Risk: 7},
				{Day: "Sun", Compliance: 98, Risk: 6},
			},
			Tasks: []PatientTask{
				{ID: "1", Title: "Take protein supplement", Time: "08:00", Completed: false, Category: "nutrition"},
				{ID: "2", Title: "Breathing exercises", Time: "10:00", Completed: true, Category: "exercise"},
				{ID: "3", Title: "Afternoon walk", Time: "16:00", Completed: false, Category: "exercise"},
				{ID: "4", Title: "Start fasting", Time: "22:00", Completed: false, Category: "nutrition"},
			},
			Sleep: buildSleepEntries([]float64{7.1, 7.5, 6.8, 7.4, 7.2, 7.0, 7.6}),
			Plan: &CarePlanDraft{
				PatientID:   "p1",
				SurgeryDate: "2026-04-15",
				Medications: []MedicationPlan{
					makeMedication("m1", "Cefuroxime", "Take as prescribed to reduce infection risk before the surgery begins safely.", "1 tablet", "every 8 hours", "after-eating", "2026-04-08T08:00:00.000Z"),
					makeMedication("m2", "Protein Supplement", "Supports healing and improves your nutritional reserve before anesthesia and recovery.", "2 scoops", "every 1 day", "after-eating", "2026-04-08T13:00:00.000Z"),
				},
				Diet: []DietItem{
					{ID: "d1", Name: "Lean chicken soup", Type: "mandatory"},
					{ID: "d2", Name: "High-protein yogurt", Type: "mandatory"},
					{ID: "d3", Name: "Boiled vegetables", Type: "recommended"},
					{ID: "d4", Name: "Fried food", Type: "not-allowed"},
					{ID: "d5", Name: "Alcohol", Type: "not-allowed"},
				},
			},
			AcceptedAt: "2026-04-01T09:15:00.000Z",
		},
		{
			Account: accountRow{
				ID:           "patient-2",
				Role:         RolePatient,
				Email:        "siti@example.com",
				PasswordHash: string(passwordHash),
				DisplayName:  "Siti Aminah",
				FirstName:    "Siti",
				LastName:     "Aminah",
				ThemeMode:    ThemeBlueMedical,
				AccentColor:  "#2563eb",
				PatientCode:  "p2",
				PatientStage: StageEmpty,
			},
			Name:             "Siti Aminah",
			Procedure:        "Herniorrhaphy",
			Specialty:        "General Surgery",
			Compliance:       45,
			Risk:             "High",
			RiskScore:        18,
			Notes:            "Requires proactive outreach. Compliance remains below threshold for safe readiness.",
			NextAppointment:  "Today, 03:30 PM",
			SurgeryDuration:  "90 Minutes",
			HospitalStay:     "2 Days",
			LastConsultation: "Today, 09:20",
			Streak:           1,
			DaysUntilSurgery: 6,
			Progress: []ProgressPoint{
				{Day: "Mon", Compliance: 44, Risk: 19},
				{Day: "Tue", Compliance: 47, Risk: 18},
				{Day: "Wed", Compliance: 42, Risk: 19},
				{Day: "Thu", Compliance: 40, Risk: 20},
				{Day: "Fri", Compliance: 45, Risk: 18},
				{Day: "Sat", Compliance: 48, Risk: 17},
				{Day: "Sun", Compliance: 50, Risk: 17},
			},
			Tasks: []PatientTask{
				{ID: "1", Title: "Morning medication", Time: "08:00", Completed: true, Category: "medication"},
				{ID: "2", Title: "Walk 15 mins", Time: "11:00", Completed: false, Category: "exercise"},
				{ID: "3", Title: "Avoid smoking", Time: "All day", Completed: false, Category: "nutrition"},
				{ID: "4", Title: "Evening medication", Time: "20:00", Completed: false, Category: "medication"},
			},
			Sleep: buildSleepEntries([]float64{5.5, 6.0, 5.8, 6.2, 5.7, 5.9, 6.1}),
			Plan: &CarePlanDraft{
				PatientID:   "p2",
				SurgeryDate: "2026-04-13",
				Medications: []MedicationPlan{
					makeMedication("m1", "Amoxicillin", "Use to keep the pre-operative infection risk under closer control each day.", "1 capsule", "every 12 hours", "after-eating", "2026-04-08T07:00:00.000Z"),
				},
				Diet: []DietItem{
					{ID: "d1", Name: "Oatmeal", Type: "mandatory"},
					{ID: "d2", Name: "Fresh fruit", Type: "recommended"},
					{ID: "d3", Name: "Cigarettes", Type: "not-allowed"},
				},
			},
			AcceptedAt: "2026-04-01T10:20:00.000Z",
		},
		{
			Account: accountRow{
				ID:           "patient-3",
				Role:         RolePatient,
				Email:        "agus@example.com",
				PasswordHash: string(passwordHash),
				DisplayName:  "Agus Wijaya",
				FirstName:    "Agus",
				LastName:     "Wijaya",
				ThemeMode:    ThemeBlueMedical,
				AccentColor:  "#2563eb",
				PatientCode:  "p3",
				PatientStage: StageEmpty,
			},
			Name:             "Agus Wijaya",
			Procedure:        "Appendectomy",
			Specialty:        "General Surgery",
			Compliance:       78,
			Risk:             "Medium",
			RiskScore:        11,
			Notes:            "Moderate compliance. Adjust communication cadence if risk score rises again.",
			NextAppointment:  "Friday, 10:00 AM",
			SurgeryDuration:  "75 Minutes",
			HospitalStay:     "1 Day",
			LastConsultation: "Monday, 10:00 AM",
			Streak:           3,
			DaysUntilSurgery: 18,
			Progress: []ProgressPoint{
				{Day: "Mon", Compliance: 70, Risk: 13},
				{Day: "Tue", Compliance: 72, Risk: 12},
				{Day: "Wed", Compliance: 75, Risk: 12},
				{Day: "Thu", Compliance: 78, Risk: 11},
				{Day: "Fri", Compliance: 80, Risk: 10},
				{Day: "Sat", Compliance: 79, Risk: 11},
				{Day: "Sun", Compliance: 78, Risk: 11},
			},
			Tasks: []PatientTask{
				{ID: "1", Title: "Protein intake check", Time: "08:30", Completed: true, Category: "nutrition"},
				{ID: "2", Title: "Breathing exercise", Time: "13:00", Completed: true, Category: "exercise"},
				{ID: "3", Title: "Hydration tracking", Time: "All day", Completed: false, Category: "nutrition"},
				{ID: "4", Title: "Walk 10 mins", Time: "17:00", Completed: false, Category: "exercise"},
			},
			Sleep: buildSleepEntries([]float64{6.8, 7.0, 6.9, 7.1, 7.2, 6.7, 7.0}),
			Plan: &CarePlanDraft{
				PatientID:   "p3",
				SurgeryDate: "2026-04-24",
				Medications: []MedicationPlan{
					makeMedication("m1", "Vitamin C", "Helps keep your nutritional preparation steady during the week before surgery.", "1 tablet", "every 1 day", "after-eating", "2026-04-08T09:30:00.000Z"),
				},
				Diet: []DietItem{
					{ID: "d1", Name: "Steamed fish", Type: "mandatory"},
					{ID: "d2", Name: "Brown rice", Type: "recommended"},
					{ID: "d3", Name: "Sugary soda", Type: "not-allowed"},
				},
			},
			AcceptedAt: "2026-04-01T11:10:00.000Z",
		},
		{
			Account: accountRow{
				ID:           "patient-4",
				Role:         RolePatient,
				Email:        "rina@example.com",
				PasswordHash: string(passwordHash),
				DisplayName:  "Rina Mahendra",
				FirstName:    "Rina",
				LastName:     "Mahendra",
				ThemeMode:    ThemeBlueMedical,
				AccentColor:  "#2563eb",
				PatientCode:  "p4",
				PatientStage: StageEmpty,
			},
			Name:             "Rina Mahendra",
			Procedure:        "Thyroid Lobectomy",
			Specialty:        "Endocrine Surgery",
			Compliance:       88,
			Risk:             "Low",
			RiskScore:        7,
			Notes:            "Ready for onboarding into the preparation workflow.",
			NextAppointment:  "Next Week, 11:00 AM",
			SurgeryDuration:  "120 Minutes",
			HospitalStay:     "2 - 3 Days",
			LastConsultation: "No prior consultation",
			Streak:           0,
			DaysUntilSurgery: 20,
			Progress: []ProgressPoint{
				{Day: "Mon", Compliance: 84, Risk: 9},
				{Day: "Tue", Compliance: 86, Risk: 8},
				{Day: "Wed", Compliance: 87, Risk: 8},
				{Day: "Thu", Compliance: 88, Risk: 7},
				{Day: "Fri", Compliance: 90, Risk: 7},
				{Day: "Sat", Compliance: 89, Risk: 7},
				{Day: "Sun", Compliance: 88, Risk: 7},
			},
			Tasks: []PatientTask{
				{ID: "1", Title: "Review pre-op instructions", Time: "09:00", Completed: false, Category: "nutrition"},
				{ID: "2", Title: "Gentle breathing drill", Time: "14:00", Completed: false, Category: "exercise"},
				{ID: "3", Title: "Hydration reminder", Time: "All day", Completed: false, Category: "nutrition"},
			},
			Sleep: buildSleepEntries([]float64{7.3, 7.2, 7.1, 7.4, 7.0, 7.5, 7.2}),
		},
	}

	for _, seed := range patientSeeds {
		if err := insertAccount(ctx, tx, seed.Account); err != nil {
			return err
		}
		if err := insertPatientSeed(ctx, tx, doctor.ID, seed); err != nil {
			return err
		}
		if seed.Plan != nil {
			if err := insertCarePlanSeed(ctx, tx, seed.Account.PatientCode, seed.Procedure, seed.Plan, InviteActive, seed.AcceptedAt); err != nil {
				return err
			}
		}
	}

	if err := insertCalendarSeed(ctx, tx, "p1", doctor.ID, CalendarEventCreatePayload{
		Type:    "appointment",
		Title:   "Pre-op consultation",
		Detail:  "Review anesthesia checklist and nutrition readiness.",
		StartAt: "2026-04-09T09:00:00.000Z",
		EndAt:   "2026-04-09T09:45:00.000Z",
	}); err != nil {
		return err
	}

	if err := insertCalendarSeed(ctx, tx, "p2", doctor.ID, CalendarEventCreatePayload{
		Type:    "task",
		Title:   "Smoking cessation call",
		Detail:  "Follow up on smoking restrictions before the procedure.",
		StartAt: "2026-04-10T14:00:00.000Z",
		EndAt:   "2026-04-10T14:30:00.000Z",
	}); err != nil {
		return err
	}

	return tx.Commit()
}

func buildSleepEntries(hours []float64) []SleepEntry {
	entries := make([]SleepEntry, 0, len(hours))
	for index, value := range hours {
		entries = append(entries, SleepEntry{
			Date:  fmt.Sprintf("2026-04-%02d", index+1),
			Hours: value,
		})
	}
	return entries
}

func makeMedication(id, name, description, amount, frequency string, mealTiming MealTiming, nextDose string) MedicationPlan {
	return MedicationPlan{
		ID:          id,
		Name:        name,
		Description: description,
		Schedule: MedicationSchedule{
			Amount:     amount,
			Frequency:  frequency,
			MealTiming: mealTiming,
			NextDoseAt: nextDose,
		},
	}
}

func insertAccount(ctx context.Context, tx *sql.Tx, account accountRow) error {
	_, err := tx.ExecContext(ctx, `
		INSERT INTO accounts (
			id, role, email, password_hash, display_name, first_name, last_name, license_number,
			patient_code, theme_mode, accent_color, consent_accepted, patient_stage
		) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
	`,
		account.ID, account.Role, account.Email, account.PasswordHash, account.DisplayName, account.FirstName,
		account.LastName, account.LicenseNumber, nullIfEmpty(account.PatientCode), account.ThemeMode,
		account.AccentColor, account.ConsentAccepted, account.PatientStage,
	)
	return err
}

func insertPatientSeed(ctx context.Context, tx *sql.Tx, doctorID string, seed struct {
	Account          accountRow
	Name             string
	Procedure        string
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
	Progress         []ProgressPoint
	Tasks            []PatientTask
	Sleep            []SleepEntry
	Plan             *CarePlanDraft
	AcceptedAt       string
}) error {
	progressJSON, _ := json.Marshal(seed.Progress)
	tasksJSON, _ := json.Marshal(seed.Tasks)
	sleepJSON, _ := json.Marshal(seed.Sleep)

	_, err := tx.ExecContext(ctx, `
		INSERT INTO patients (
			patient_code, account_id, doctor_account_id, email, name, procedure, doctor_name, specialty,
			compliance, risk, risk_score, notes, next_appointment, surgery_duration, hospital_stay,
			last_consultation, streak, days_until_surgery, progress, tasks, sleep_entries, surgery_decision
		) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
	`,
		seed.Account.PatientCode, seed.Account.ID, doctorID, seed.Account.Email, seed.Name, seed.Procedure,
		"Dr. Andi Setiawan", seed.Specialty, seed.Compliance, seed.Risk, seed.RiskScore, seed.Notes,
		seed.NextAppointment, seed.SurgeryDuration, seed.HospitalStay, seed.LastConsultation, seed.Streak,
		seed.DaysUntilSurgery, string(progressJSON), string(tasksJSON), string(sleepJSON), DecisionNone,
	)
	return err
}

func insertCarePlanSeed(ctx context.Context, tx *sql.Tx, patientCode, procedure string, plan *CarePlanDraft, status PendingInviteStatus, acceptedAt string) error {
	medicationsJSON, _ := json.Marshal(plan.Medications)
	dietJSON, _ := json.Marshal(plan.Diet)
	var acceptedAtValue interface{}
	if acceptedAt != "" {
		parsed, err := time.Parse(time.RFC3339, acceptedAt)
		if err == nil {
			acceptedAtValue = parsed
		}
	}
	_, err := tx.ExecContext(ctx, `
		INSERT INTO care_plans (
			id, patient_code, invite_id, procedure, surgery_date, surgery_document,
			medications, diet, invite_status, accepted_at
		) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
	`,
		fmt.Sprintf("plan-%s", patientCode),
		patientCode,
		fmt.Sprintf("invite-%s-active", patientCode),
		procedure,
		plan.SurgeryDate,
		nil,
		string(medicationsJSON),
		string(dietJSON),
		status,
		acceptedAtValue,
	)
	return err
}

func insertCalendarSeed(ctx context.Context, tx *sql.Tx, patientCode, creatorID string, payload CalendarEventCreatePayload) error {
	var recurrenceJSON interface{}
	if payload.Recurrence != nil {
		raw, _ := json.Marshal(payload.Recurrence)
		recurrenceJSON = string(raw)
	}
	_, err := tx.ExecContext(ctx, `
		INSERT INTO calendar_events (
			id, patient_code, type, title, detail, start_at, end_at, all_day, medication_id, recurrence, created_by_user_id
		) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
	`,
		uuid.NewString(), patientCode, payload.Type, payload.Title, payload.Detail, payload.StartAt, nullIfEmpty(payload.EndAt),
		payload.AllDay, payload.MedicationID, recurrenceJSON, creatorID,
	)
	return err
}
