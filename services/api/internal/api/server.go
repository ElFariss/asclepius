package api

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
)

type Config struct {
	DatabaseURL   string
	Port          string
	CORSOrigin    string
	StorageDir    string
	PublicBaseURL string
	WorkDir       string
}

type Server struct {
	db            *sql.DB
	config        Config
	storageDir    string
	publicBaseURL string
	mux           *http.ServeMux
}

type contextKey string

const userContextKey contextKey = "user"

func NewServer(config Config) (*Server, error) {
	db, err := sql.Open("pgx", config.DatabaseURL)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		return nil, err
	}

	migrationPath := filepath.Join(config.WorkDir, "migrations", "001_init.sql")
	migrationSQL, err := os.ReadFile(migrationPath)
	if err != nil {
		return nil, err
	}
	if err := runMigrations(ctx, db, string(migrationSQL)); err != nil {
		return nil, err
	}

	server := &Server{
		db:            db,
		config:        config,
		storageDir:    config.StorageDir,
		publicBaseURL: strings.TrimSuffix(config.PublicBaseURL, "/"),
		mux:           http.NewServeMux(),
	}
	if err := seedIfNeeded(ctx, db); err != nil {
		return nil, err
	}
	server.registerRoutes()
	return server, nil
}

func (s *Server) registerRoutes() {
	s.mux.HandleFunc("/health", s.handleHealth)
	s.mux.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir(s.storageDir))))
	s.mux.HandleFunc("/api/auth/login", s.handleLogin)
	s.mux.HandleFunc("/api/auth/register", s.handleRegister)
	s.mux.Handle("/api/auth/logout", s.withAuth(s.handleLogout))
	s.mux.Handle("/api/me", s.withAuth(s.handleMe))
	s.mux.Handle("/api/me/avatar", s.withAuth(s.handleAvatar))
	s.mux.Handle("/api/patient/invite", s.withAuthRole(RolePatient, s.handlePatientInvite))
	s.mux.Handle("/api/patient/invite/accept", s.withAuthRole(RolePatient, s.handlePatientInviteAccept))
	s.mux.Handle("/api/patient/profile", s.withAuthRole(RolePatient, s.handlePatientProfile))
	s.mux.Handle("/api/patient/tasks", s.withAuthRole(RolePatient, s.handlePatientTasks))
	s.mux.Handle("/api/patient/progress", s.withAuthRole(RolePatient, s.handlePatientProgress))
	s.mux.Handle("/api/patient/medicines", s.withAuthRole(RolePatient, s.handlePatientMedicines))
	s.mux.Handle("/api/patient/diet", s.withAuthRole(RolePatient, s.handlePatientDiet))
	s.mux.Handle("/api/patient/calendar", s.withAuthRole(RolePatient, s.handlePatientCalendar))
	s.mux.Handle("/api/patient/sleep", s.withAuthRole(RolePatient, s.handlePatientSleep))
	s.mux.Handle("/api/patient/stage", s.withAuthRole(RolePatient, s.handlePatientStage))
	s.mux.Handle("/api/patient/consent", s.withAuthRole(RolePatient, s.handlePatientConsent))
	s.mux.Handle("/api/doctor/dashboard", s.withAuthRole(RoleDoctor, s.handleDoctorDashboard))
	s.mux.Handle("/api/doctor/patients/pending-care-plan", s.withAuthRole(RoleDoctor, s.handleDoctorPendingCarePlan))
	s.mux.Handle("/api/doctor/patients/", s.withAuthRole(RoleDoctor, s.handleDoctorPatientRoutes))
}

func (s *Server) Handler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		s.applyCORS(w, r)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		s.mux.ServeHTTP(w, r)
	})
}

func (s *Server) applyCORS(w http.ResponseWriter, r *http.Request) {
	origin := s.config.CORSOrigin
	if origin == "" {
		origin = r.Header.Get("Origin")
	}
	if origin != "" {
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Vary", "Origin")
	}
	w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS")
}

func (s *Server) handleHealth(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func readJSON[T any](w http.ResponseWriter, r *http.Request) (T, bool) {
	var payload T
	body, err := io.ReadAll(r.Body)
	if err != nil {
		writeError(w, http.StatusBadRequest, "unable to read request")
		return payload, false
	}
	if len(body) == 0 {
		return payload, true
	}
	if err := json.Unmarshal(body, &payload); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json payload")
		return payload, false
	}
	return payload, true
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func (s *Server) assetURL(path string) string {
	if strings.TrimSpace(path) == "" {
		return ""
	}
	if strings.HasPrefix(path, "http://") || strings.HasPrefix(path, "https://") {
		return path
	}
	if s.publicBaseURL == "" {
		return path
	}
	return s.publicBaseURL + path
}

func (s *Server) withAuth(next func(http.ResponseWriter, *http.Request, accountRow)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := strings.TrimSpace(strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer "))
		if token == "" {
			writeError(w, http.StatusUnauthorized, "missing auth token")
			return
		}
		account, err := s.accountByToken(r.Context(), token)
		if err != nil {
			writeError(w, http.StatusUnauthorized, "invalid auth token")
			return
		}
		next(w, r.WithContext(context.WithValue(r.Context(), userContextKey, account)), account)
	})
}

func (s *Server) withAuthRole(role UserRole, next func(http.ResponseWriter, *http.Request, accountRow)) http.Handler {
	return s.withAuth(func(w http.ResponseWriter, r *http.Request, account accountRow) {
		if account.Role != role {
			writeError(w, http.StatusForbidden, "forbidden")
			return
		}
		next(w, r, account)
	})
}

func (s *Server) handleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	payload, ok := readJSON[AuthFormPayload](w, r)
	if !ok {
		return
	}
	account, err := s.accountByEmail(r.Context(), payload.Email)
	if err != nil || !authenticatePassword(account.PasswordHash, payload.Password) {
		writeError(w, http.StatusUnauthorized, "invalid email or password")
		return
	}
	session, err := s.createSession(r.Context(), account)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "unable to create session")
		return
	}
	writeJSON(w, http.StatusOK, SessionResponse{Token: session.Token, Session: session})
}

func (s *Server) handleRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	role := UserRole(r.URL.Query().Get("role"))
	if role != RoleDoctor && role != RolePatient {
		writeError(w, http.StatusBadRequest, "invalid role")
		return
	}
	payload, ok := readJSON[AuthFormPayload](w, r)
	if !ok {
		return
	}
	session, err := s.registerAccount(r.Context(), role, payload)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, http.StatusCreated, SessionResponse{Token: session.Token, Session: session})
}

func (s *Server) handleLogout(w http.ResponseWriter, r *http.Request, _ accountRow) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	token := strings.TrimSpace(strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer "))
	if token != "" {
		_ = s.deleteSession(r.Context(), token)
	}
	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) handleMe(w http.ResponseWriter, r *http.Request, account accountRow) {
	switch r.Method {
	case http.MethodGet:
		writeJSON(w, http.StatusOK, s.userProfile(account))
	case http.MethodPatch:
		payload, ok := readJSON[UpdateProfilePayload](w, r)
		if !ok {
			return
		}
		updated, err := s.updateProfile(r.Context(), account, payload)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "unable to update profile")
			return
		}
		writeJSON(w, http.StatusOK, s.userProfile(updated))
	default:
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func (s *Server) handleAvatar(w http.ResponseWriter, r *http.Request, account accountRow) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	payload, ok := readJSON[UploadAssetPayload](w, r)
	if !ok {
		return
	}
	updated, err := s.updateAvatar(r.Context(), account, payload)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "unable to upload avatar")
		return
	}
	writeJSON(w, http.StatusOK, s.userProfile(updated))
}

func (s *Server) handlePatientInvite(w http.ResponseWriter, r *http.Request, account accountRow) {
	if r.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	invite, err := s.patientInvite(r.Context(), account.PatientCode)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "unable to load invite")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"invite": invite})
}

func (s *Server) handlePatientInviteAccept(w http.ResponseWriter, r *http.Request, account accountRow) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	if err := s.acceptInvite(r.Context(), account.PatientCode); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			writeError(w, http.StatusNotFound, "pending invite not found")
			return
		}
		writeError(w, http.StatusInternalServerError, "unable to accept invite")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) handlePatientProfile(w http.ResponseWriter, r *http.Request, account accountRow) {
	if r.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	profile, err := s.patientProfile(r.Context(), account.PatientCode)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "unable to load patient profile")
		return
	}
	writeJSON(w, http.StatusOK, profile)
}

func (s *Server) handlePatientTasks(w http.ResponseWriter, r *http.Request, account accountRow) {
	switch r.Method {
	case http.MethodGet:
		tasks, err := s.patientTasks(r.Context(), account.PatientCode)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "unable to load tasks")
			return
		}
		writeJSON(w, http.StatusOK, tasks)
	case http.MethodPatch:
		var payload struct {
			TaskID    string `json:"taskId"`
			Completed bool   `json:"completed"`
		}
		value, ok := readJSON[struct {
			TaskID    string `json:"taskId"`
			Completed bool   `json:"completed"`
		}](w, r)
		if !ok {
			return
		}
		payload = value
		tasks, err := s.updateTask(r.Context(), account.PatientCode, payload.TaskID, payload.Completed)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "unable to update task")
			return
		}
		writeJSON(w, http.StatusOK, tasks)
	default:
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func (s *Server) handlePatientProgress(w http.ResponseWriter, r *http.Request, account accountRow) {
	if r.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	progress, err := s.patientProgress(r.Context(), account.PatientCode)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "unable to load progress")
		return
	}
	writeJSON(w, http.StatusOK, progress)
}

func (s *Server) handlePatientMedicines(w http.ResponseWriter, r *http.Request, account accountRow) {
	if r.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	items, err := s.patientMedications(r.Context(), account.PatientCode)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "unable to load medicines")
		return
	}
	writeJSON(w, http.StatusOK, items)
}

func (s *Server) handlePatientDiet(w http.ResponseWriter, r *http.Request, account accountRow) {
	if r.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	items, err := s.patientDiet(r.Context(), account.PatientCode)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "unable to load diet")
		return
	}
	writeJSON(w, http.StatusOK, items)
}

func queryInt(value string, fallback int) int {
	parsed, err := strconv.Atoi(value)
	if err != nil || parsed <= 0 {
		return fallback
	}
	return parsed
}

func (s *Server) handlePatientCalendar(w http.ResponseWriter, r *http.Request, account accountRow) {
	if r.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	now := time.Now()
	year := queryInt(r.URL.Query().Get("year"), now.Year())
	month := queryInt(r.URL.Query().Get("month"), int(now.Month()))
	value, err := s.patientCalendar(r.Context(), account.PatientCode, year, month)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "unable to load calendar")
		return
	}
	writeJSON(w, http.StatusOK, value)
}

func (s *Server) handlePatientSleep(w http.ResponseWriter, r *http.Request, account accountRow) {
	if r.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	value, err := s.patientSleep(r.Context(), account.PatientCode)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "unable to load sleep summary")
		return
	}
	writeJSON(w, http.StatusOK, value)
}

func (s *Server) handlePatientStage(w http.ResponseWriter, r *http.Request, account accountRow) {
	if r.Method != http.MethodPatch {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	payload, ok := readJSON[struct {
		Stage PatientJourneyStage `json:"stage"`
	}](w, r)
	if !ok {
		return
	}
	if err := s.updatePatientStage(r.Context(), account, payload.Stage); err != nil {
		writeError(w, http.StatusBadRequest, "unable to update stage")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) handlePatientConsent(w http.ResponseWriter, r *http.Request, account accountRow) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	if err := s.acceptPatientConsent(r.Context(), account); err != nil {
		writeError(w, http.StatusBadRequest, "unable to accept consent")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) handleDoctorDashboard(w http.ResponseWriter, r *http.Request, account accountRow) {
	if r.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	value, err := s.doctorDashboard(r.Context(), account)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "unable to load doctor dashboard")
		return
	}
	writeJSON(w, http.StatusOK, value)
}

func (s *Server) handleDoctorPendingCarePlan(w http.ResponseWriter, r *http.Request, _ accountRow) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	payload, ok := readJSON[CarePlanDraft](w, r)
	if !ok {
		return
	}
	if err := s.createPendingCarePlan(r.Context(), payload); err != nil {
		writeError(w, http.StatusInternalServerError, "unable to create pending care plan")
		return
	}
	w.WriteHeader(http.StatusCreated)
}

func (s *Server) handleDoctorPatientRoutes(w http.ResponseWriter, r *http.Request, account accountRow) {
	path := strings.TrimPrefix(r.URL.Path, "/api/doctor/patients/")
	switch {
	case strings.HasPrefix(path, "lookup/"):
		patientCode := strings.TrimPrefix(path, "lookup/")
		profile, err := s.lookupPatient(r.Context(), patientCode)
		if err != nil {
			writeError(w, http.StatusNotFound, "patient not found")
			return
		}
		writeJSON(w, http.StatusOK, profile)
	case strings.HasSuffix(path, "/calendar"):
		patientCode := strings.TrimSuffix(path, "/calendar")
		year := queryInt(r.URL.Query().Get("year"), time.Now().Year())
		value, err := s.doctorCalendar(r.Context(), patientCode, year)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "unable to load patient calendar")
			return
		}
		writeJSON(w, http.StatusOK, value)
	case strings.HasSuffix(path, "/calendar-events"):
		if r.Method != http.MethodPost {
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
			return
		}
		patientCode := strings.TrimSuffix(path, "/calendar-events")
		payload, ok := readJSON[CalendarEventCreatePayload](w, r)
		if !ok {
			return
		}
		if err := s.createCalendarEvent(r.Context(), patientCode, account.ID, payload); err != nil {
			writeError(w, http.StatusInternalServerError, "unable to create calendar event")
			return
		}
		w.WriteHeader(http.StatusCreated)
	case strings.HasSuffix(path, "/surgery-decision"):
		if r.Method != http.MethodPatch {
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
			return
		}
		patientCode := strings.TrimSuffix(path, "/surgery-decision")
		payload, ok := readJSON[SurgeryDecisionPayload](w, r)
		if !ok {
			return
		}
		if err := s.setSurgeryDecision(r.Context(), patientCode, payload.Decision); err != nil {
			writeError(w, http.StatusBadRequest, "unable to update surgery decision")
			return
		}
		w.WriteHeader(http.StatusNoContent)
	default:
		if r.Method != http.MethodGet {
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
			return
		}
		detail, err := s.doctorPatientDetail(r.Context(), path)
		if err != nil {
			writeError(w, http.StatusNotFound, "patient not found")
			return
		}
		writeJSON(w, http.StatusOK, detail)
	}
}
