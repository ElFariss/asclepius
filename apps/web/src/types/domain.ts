export type UserRole = "patient" | "doctor";
export type RiskLevel = "Low" | "Medium" | "High";
export type TaskCategory = "medication" | "exercise" | "nutrition";
export type PatientJourneyStage = "empty" | "invite" | "surgery" | "consent" | "dashboard";
export type SurgeryDecision = "none" | "proceed" | "postpone";
export type PendingInviteStatus = "active" | "pending-acceptance" | "archived";
export type ThemeMode = "blue-medical" | "green-forest";
export type DietType = "mandatory" | "recommended" | "not-allowed";
export type MealTiming = "before-eating" | "after-eating";
export type CalendarEventType = "task" | "medication" | "appointment" | "surgery";
export type SurgeryPlanFormat = "pdf" | "docx";

export interface AuthFormPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  licenseNumber?: string;
}

export interface AuthSession {
  token: string;
  userId: string;
  role: UserRole;
  displayName: string;
  email: string;
  avatarUrl: string;
  themeMode: ThemeMode;
  accentColor: string;
  consentAccepted: boolean;
  patientStage: PatientJourneyStage;
}

export interface ProgressPoint {
  day: string;
  compliance: number;
  risk: number;
}

export interface PatientTask {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  category: TaskCategory;
}

export interface SurgeryPlanDocument {
  id: string;
  name: string;
  format: SurgeryPlanFormat;
  mimeType: string;
  data?: string;
  url?: string;
}

export interface MedicationSchedule {
  amount: string;
  frequency: string;
  mealTiming: MealTiming;
  nextDoseAt: string;
}

export interface MedicationPlan {
  id: string;
  name: string;
  description: string;
  schedule: MedicationSchedule;
}

export interface MedicationReminder {
  medicationId: string;
  title: string;
  startAt: string;
  recurrence?: RecurrenceRule | null;
}

export interface DietItem {
  id: string;
  name: string;
  type: DietType;
}

export interface RecurrenceEnd {
  type: "never" | "on-date" | "after-occurrences";
  endDate?: string;
  occurrences?: number;
}

export interface RecurrenceRule {
  mode: "does-not-repeat" | "every-week" | "every-month" | "custom";
  interval: number;
  unit: "day" | "week" | "month";
  weekdays?: string[];
  monthlyPattern?: "day-of-month" | "first-weekday";
  end: RecurrenceEnd;
}

export interface CalendarEventSummary {
  id: string;
  date: string;
  type: CalendarEventType;
  title: string;
  detail: string;
  previewText: string;
}

export interface CalendarEventDetail extends CalendarEventSummary {
  startAt?: string;
  endAt?: string;
  allDay: boolean;
  medicationId?: string;
  recurrence?: RecurrenceRule | null;
}

export type CalendarEvent = CalendarEventDetail;

export interface CalendarViewData {
  label: string;
  focusMonth: number;
  year: number;
  events: CalendarEvent[];
}

export interface SleepEntry {
  date: string;
  hours: number;
}

export interface SleepSummary {
  targetHours: number;
  averageHours: number;
  meetsTarget: boolean;
  entries: SleepEntry[];
}

export interface CarePlanDraft {
  patientId: string;
  surgeryDate: string;
  surgeryDocument: SurgeryPlanDocument | null;
  medications: MedicationPlan[];
  diet: DietItem[];
}

export interface PatientInvite {
  inviteId: string;
  patientId: string;
  status: PendingInviteStatus;
  doctorName: string;
  specialty: string;
  procedure: string;
  surgeryDate: string;
  hasPendingUpdate: boolean;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  procedure: string;
  compliance: number;
  risk: RiskLevel;
  riskScore: number;
  status: string;
  inviteStatus: PendingInviteStatus;
  surgeryDate: string;
  daysUntilSurgery: number;
  attendingDoctor: string;
  specialty: string;
  hospitalStay: string;
  surgeryDuration: string;
  nextAppointment: string;
}

export interface PatientLookupRecord {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  procedure: string;
  compliance: number;
  risk: RiskLevel;
  riskScore: number;
  status: string;
  inviteStatus: PendingInviteStatus;
  surgeryDate: string;
  daysUntilSurgery: number;
  attendingDoctor: string;
  specialty: string;
  hospitalStay: string;
  surgeryDuration: string;
  nextAppointment: string;
}

export interface DoctorPatientSummary {
  id: string;
  name: string;
  procedure: string;
  compliance: number;
  risk: RiskLevel;
  status: string;
  inviteStatus: PendingInviteStatus;
  avatarUrl: string;
  trend: number[];
}

export interface ComplianceSeries {
  patientId: string;
  name: string;
  color: string;
  labels: string[];
  values: number[];
}

export interface DoctorDashboardData {
  doctorName: string;
  title: string;
  activePatients: number;
  needsIntervention: number;
  patients: DoctorPatientSummary[];
  complianceSeries: ComplianceSeries[];
}

export interface PatientDetail {
  id: string;
  name: string;
  procedure: string;
  compliance: number;
  risk: RiskLevel;
  riskScore: number;
  status: string;
  inviteStatus: PendingInviteStatus;
  avatarUrl: string;
  nextAppointment: string;
  tasks: PatientTask[];
  notes: string;
  surgeryDate: string;
  surgeryDocument: SurgeryPlanDocument | null;
  medications: MedicationPlan[];
  diet: DietItem[];
  calendarPreview: CalendarEvent[];
  progress: ProgressPoint[];
  surgeryDecision: SurgeryDecision;
}

export interface UserProfile {
  id: string;
  role: UserRole;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  avatarUrl: string;
  themeMode: ThemeMode;
  accentColor: string;
  patientCode: string;
}

export interface UploadAssetPayload {
  name: string;
  mimeType: string;
  data: string;
}

export interface UpdateProfilePayload {
  displayName: string;
  firstName: string;
  lastName: string;
  themeMode: ThemeMode;
  accentColor: string;
}

export interface CalendarEventCreatePayload {
  type: CalendarEventType;
  title: string;
  detail: string;
  startAt: string;
  endAt?: string;
  allDay: boolean;
  medicationId?: string;
  recurrence?: RecurrenceRule | null;
}
