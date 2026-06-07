package api

import "time"

type UserRole string
type Workspace string

const (
	RolePatient UserRole = "patient"
	RoleDoctor  UserRole = "doctor"
)

const (
	WorkspaceLive Workspace = "live"
	WorkspaceDemo Workspace = "demo"
)

type PatientJourneyStage string

const (
	StageEmpty     PatientJourneyStage = "empty"
	StageInvite    PatientJourneyStage = "invite"
	StageSurgery   PatientJourneyStage = "surgery"
	StageConsent   PatientJourneyStage = "consent"
	StageDashboard PatientJourneyStage = "dashboard"
)

type ThemeMode string

const (
	ThemeBlueMedical ThemeMode = "blue-medical"
	ThemeGreenForest ThemeMode = "green-forest"
)

type PendingInviteStatus string

const (
	InvitePending  PendingInviteStatus = "pending-acceptance"
	InviteActive   PendingInviteStatus = "active"
	InviteArchived PendingInviteStatus = "archived"
)

type SurgeryDecision string

const (
	DecisionNone     SurgeryDecision = "none"
	DecisionProceed  SurgeryDecision = "proceed"
	DecisionPostpone SurgeryDecision = "postpone"
)

const (
	RiskSafe       RiskLevel = "Safe"
	RiskBorderline RiskLevel = "Borderline"
	RiskIntervene  RiskLevel = "Intervene"
)

type RiskLevel string

type TaskCategory string

type DietType string

type MealTiming string

type SurgeryPlanFormat string

type CalendarEventType string

type AuthFormPayload struct {
	Email         string `json:"email"`
	Password      string `json:"password"`
	FirstName     string `json:"firstName,omitempty"`
	LastName      string `json:"lastName,omitempty"`
	LicenseNumber string `json:"licenseNumber,omitempty"`
}

type SessionResponse struct {
	Token   string      `json:"token"`
	Session AuthSession `json:"session"`
}

type AuthSession struct {
	Token           string              `json:"token"`
	UserID          string              `json:"userId"`
	Role            UserRole            `json:"role"`
	Workspace       Workspace           `json:"workspace"`
	DisplayName     string              `json:"displayName"`
	Email           string              `json:"email"`
	AvatarURL       string              `json:"avatarUrl"`
	ThemeMode       ThemeMode           `json:"themeMode"`
	AccentColor     string              `json:"accentColor"`
	ConsentAccepted bool                `json:"consentAccepted"`
	PatientStage    PatientJourneyStage `json:"patientStage"`
}

type PatientMetricPoint struct {
	Day        string `json:"day"`
	Compliance int    `json:"compliance"`
	Risk       int    `json:"risk"`
}

type ProgressPoint = PatientMetricPoint

type PatientTask struct {
	ID        string       `json:"id"`
	Title     string       `json:"title"`
	Time      string       `json:"time"`
	Completed bool         `json:"completed"`
	Category  TaskCategory `json:"category"`
}

type SleepEntry struct {
	Date  string  `json:"date"`
	Hours float64 `json:"hours"`
}

type SurgeryPlanDocument struct {
	ID       string            `json:"id"`
	Name     string            `json:"name"`
	Format   SurgeryPlanFormat `json:"format"`
	MimeType string            `json:"mimeType"`
	Data     string            `json:"data,omitempty"`
	URL      string            `json:"url,omitempty"`
}

type MedicationSchedule struct {
	Amount     string     `json:"amount"`
	Frequency  string     `json:"frequency"`
	MealTiming MealTiming `json:"mealTiming"`
	NextDoseAt string     `json:"nextDoseAt"`
}

type MedicationPlan struct {
	ID          string             `json:"id"`
	Name        string             `json:"name"`
	Description string             `json:"description"`
	Schedule    MedicationSchedule `json:"schedule"`
}

type DietItem struct {
	ID   string   `json:"id"`
	Name string   `json:"name"`
	Type DietType `json:"type"`
}

type LatestCheckup struct {
	Summary   string `json:"summary"`
	CheckedAt string `json:"checkedAt"`
}

type RiskScoreEntry struct {
	ID           string `json:"id"`
	PatientID    string `json:"patientId"`
	VariableName string `json:"variableName"`
	Score        int    `json:"score"`
	Note         string `json:"note"`
	AuthorName   string `json:"authorName"`
	CreatedAt    string `json:"createdAt"`
}

type ChatMessage struct {
	ID         string   `json:"id"`
	PatientID  string   `json:"patientId"`
	SenderRole UserRole `json:"senderRole"`
	SenderName string   `json:"senderName"`
	Body       string   `json:"body"`
	CreatedAt  string   `json:"createdAt"`
}

type ChatThread struct {
	PatientID string        `json:"patientId"`
	Messages  []ChatMessage `json:"messages"`
}

type RecurrenceEnd struct {
	Type        string `json:"type"`
	EndDate     string `json:"endDate,omitempty"`
	Occurrences int    `json:"occurrences,omitempty"`
}

type RecurrenceRule struct {
	Mode           string        `json:"mode"`
	Interval       int           `json:"interval"`
	Unit           string        `json:"unit"`
	Weekdays       []string      `json:"weekdays,omitempty"`
	MonthlyPattern string        `json:"monthlyPattern,omitempty"`
	End            RecurrenceEnd `json:"end"`
}

type CalendarEvent struct {
	ID           string            `json:"id"`
	Date         string            `json:"date"`
	Type         CalendarEventType `json:"type"`
	Title        string            `json:"title"`
	Detail       string            `json:"detail"`
	PreviewText  string            `json:"previewText"`
	VariableName string            `json:"variableName,omitempty"`
	StartAt      string            `json:"startAt,omitempty"`
	EndAt        string            `json:"endAt,omitempty"`
	AllDay       bool              `json:"allDay"`
	MedicationID string            `json:"medicationId,omitempty"`
	Recurrence   *RecurrenceRule   `json:"recurrence,omitempty"`
}

type CalendarViewData struct {
	Label      string          `json:"label"`
	FocusMonth int             `json:"focusMonth"`
	Year       int             `json:"year"`
	Events     []CalendarEvent `json:"events"`
}

type SleepSummary struct {
	TargetHours  float64      `json:"targetHours"`
	AverageHours float64      `json:"averageHours"`
	MeetsTarget  bool         `json:"meetsTarget"`
	Entries      []SleepEntry `json:"entries"`
}

type PatientInvite struct {
	InviteID         string              `json:"inviteId"`
	PatientID        string              `json:"patientId"`
	Status           PendingInviteStatus `json:"status"`
	DoctorName       string              `json:"doctorName"`
	Specialty        string              `json:"specialty"`
	Procedure        string              `json:"procedure"`
	SurgeryDate      string              `json:"surgeryDate"`
	HasPendingUpdate bool                `json:"hasPendingUpdate"`
}

type PatientProfile struct {
	ID               string              `json:"id"`
	Name             string              `json:"name"`
	Email            string              `json:"email"`
	AvatarURL        string              `json:"avatarUrl"`
	Procedure        string              `json:"procedure"`
	Compliance       int                 `json:"compliance"`
	Risk             RiskLevel           `json:"risk"`
	RiskScore        int                 `json:"riskScore"`
	Status           string              `json:"status"`
	InviteStatus     PendingInviteStatus `json:"inviteStatus"`
	SurgeryDate      string              `json:"surgeryDate"`
	DaysUntilSurgery int                 `json:"daysUntilSurgery"`
	AttendingDoctor  string              `json:"attendingDoctor"`
	Specialty        string              `json:"specialty"`
	HospitalStay     string              `json:"hospitalStay"`
	SurgeryDuration  string              `json:"surgeryDuration"`
	NextAppointment  string              `json:"nextAppointment"`
}

type DoctorPatientSummary struct {
	ID           string              `json:"id"`
	Name         string              `json:"name"`
	Procedure    string              `json:"procedure"`
	Compliance   int                 `json:"compliance"`
	Risk         RiskLevel           `json:"risk"`
	Status       string              `json:"status"`
	InviteStatus PendingInviteStatus `json:"inviteStatus"`
	AvatarURL    string              `json:"avatarUrl"`
	Metrics      []int               `json:"metrics"`
}

type MetricSeries struct {
	PatientID string   `json:"patientId"`
	Name      string   `json:"name"`
	Color     string   `json:"color"`
	Labels    []string `json:"labels"`
	Values    []int    `json:"values"`
}

type ComplianceSeries = MetricSeries

type DoctorDashboardData struct {
	DoctorName        string                 `json:"doctorName"`
	Title             string                 `json:"title"`
	ActivePatients    int                    `json:"activePatients"`
	NeedsIntervention int                    `json:"needsIntervention"`
	Patients          []DoctorPatientSummary `json:"patients"`
	MetricSeries      []MetricSeries         `json:"metricSeries"`
}

type PatientDetail struct {
	ID              string               `json:"id"`
	Name            string               `json:"name"`
	Procedure       string               `json:"procedure"`
	Compliance      int                  `json:"compliance"`
	Risk            RiskLevel            `json:"risk"`
	RiskScore       int                  `json:"riskScore"`
	Status          string               `json:"status"`
	InviteStatus    PendingInviteStatus  `json:"inviteStatus"`
	AvatarURL       string               `json:"avatarUrl"`
	NextAppointment string               `json:"nextAppointment"`
	Tasks           []PatientTask        `json:"tasks"`
	Notes           string               `json:"notes"`
	SurgeryDate     string               `json:"surgeryDate"`
	SurgeryDocument *SurgeryPlanDocument `json:"surgeryDocument"`
	Medications     []MedicationPlan     `json:"medications"`
	Diet            []DietItem           `json:"diet"`
	CalendarPreview []CalendarEvent      `json:"calendarPreview"`
	Metrics         []PatientMetricPoint `json:"metrics"`
	RiskEntries     []RiskScoreEntry     `json:"riskEntries"`
	LatestCheckup   LatestCheckup        `json:"latestCheckup"`
	SurgeryDecision SurgeryDecision      `json:"surgeryDecision"`
}

type UserProfile struct {
	ID            string    `json:"id"`
	Role          UserRole  `json:"role"`
	Workspace     Workspace `json:"workspace"`
	Email         string    `json:"email"`
	DisplayName   string    `json:"displayName"`
	FirstName     string    `json:"firstName"`
	LastName      string    `json:"lastName"`
	LicenseNumber string    `json:"licenseNumber"`
	AvatarURL     string    `json:"avatarUrl"`
	ThemeMode     ThemeMode `json:"themeMode"`
	AccentColor   string    `json:"accentColor"`
	PatientCode   string    `json:"patientCode"`
}

type UpdateProfilePayload struct {
	DisplayName string    `json:"displayName"`
	FirstName   string    `json:"firstName"`
	LastName    string    `json:"lastName"`
	ThemeMode   ThemeMode `json:"themeMode"`
	AccentColor string    `json:"accentColor"`
}

type UploadAssetPayload struct {
	Name     string `json:"name"`
	MimeType string `json:"mimeType"`
	Data     string `json:"data"`
}

type CarePlanDraft struct {
	PatientID       string               `json:"patientId"`
	SurgeryDate     string               `json:"surgeryDate"`
	SurgeryDocument *SurgeryPlanDocument `json:"surgeryDocument"`
	Medications     []MedicationPlan     `json:"medications"`
	Diet            []DietItem           `json:"diet"`
}

type CalendarEventCreatePayload struct {
	Type         CalendarEventType `json:"type"`
	Title        string            `json:"title"`
	Detail       string            `json:"detail"`
	VariableName string            `json:"variableName,omitempty"`
	StartAt      string            `json:"startAt"`
	EndAt        string            `json:"endAt,omitempty"`
	AllDay       bool              `json:"allDay"`
	MedicationID string            `json:"medicationId,omitempty"`
	Recurrence   *RecurrenceRule   `json:"recurrence,omitempty"`
}

type ChatMessageCreatePayload struct {
	Body string `json:"body"`
}

type RiskScoreCreatePayload struct {
	VariableName string `json:"variableName"`
	Score        int    `json:"score"`
	Note         string `json:"note"`
}

type LatestCheckupPayload struct {
	Summary   string `json:"summary"`
	CheckedAt string `json:"checkedAt"`
}

type DemoSessionPayload struct {
	Role UserRole `json:"role"`
}

type SurgeryDecisionPayload struct {
	Decision SurgeryDecision `json:"decision"`
}

type accountRow struct {
	ID              string
	Role            UserRole
	Workspace       Workspace
	Email           string
	PasswordHash    string
	DisplayName     string
	FirstName       string
	LastName        string
	LicenseNumber   string
	PatientCode     string
	AvatarPath      string
	ThemeMode       ThemeMode
	AccentColor     string
	ConsentAccepted bool
	PatientStage    PatientJourneyStage
	CreatedAt       time.Time
}
