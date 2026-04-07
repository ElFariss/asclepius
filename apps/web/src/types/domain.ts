export type UserRole = "patient" | "doctor";
export type RiskLevel = "Low" | "Medium" | "High";
export type TaskCategory = "medication" | "exercise" | "nutrition";
export type PatientJourneyStage = "empty" | "invite" | "surgery" | "consent" | "dashboard";
export type SurgeryDecision = "none" | "go" | "no-go";
export type PendingInviteStatus = "active" | "pending-acceptance";
export type ThemeMode = "blue-medical" | "green-forest";
export type DietType = "mandatory" | "recommended" | "not-allowed";
export type MealTiming = "before-eating" | "after-eating";
export type CalendarEventType = "medication" | "appointment" | "surgery";
export type SurgeryPlanFormat = "pdf" | "docx";

export interface AuthFormPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  licenseNumber?: string;
}

export interface AuthSession {
  userId: string;
  role: UserRole;
  displayName: string;
  email: string;
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

export interface PatientLookupRecord {
  id: string;
  email: string;
  name: string;
  procedure: string;
  doctorName: string;
  specialty: string;
  compliance: number;
  risk: RiskLevel;
  riskScore: number;
  notes: string;
  nextAppointment: string;
  surgeryDuration: string;
  hospitalStay: string;
  lastConsultation: string;
  streak: number;
  daysUntilSurgery: number;
}

export interface SurgeryPlanDocument {
  id: string;
  name: string;
  format: SurgeryPlanFormat;
  mimeType: string;
  data: string;
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

export interface DietItem {
  id: string;
  name: string;
  type: DietType;
}

export interface CalendarEvent {
  id: string;
  date: string;
  type: CalendarEventType;
  title: string;
  detail: string;
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

export interface PatientCarePlan extends CarePlanDraft {
  inviteId: string;
  procedure: string;
  calendarEvents: CalendarEvent[];
  sleepEntries: SleepEntry[];
  inviteStatus: PendingInviteStatus;
  createdAt: string;
  acceptedAt: string | null;
}

export interface PendingInvitePreview {
  inviteId: string;
  patientId: string;
  status: PendingInviteStatus;
  doctorName: string;
  specialty: string;
  procedure: string;
  surgeryDate: string;
}

export interface PatientInvite extends PendingInvitePreview {
  hasPendingUpdate: boolean;
}

export interface Patient {
  id: string;
  name: string;
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
  riskScore: number;
  status: string;
  inviteStatus: PendingInviteStatus;
}

export interface PatientDetail extends DoctorPatientSummary {
  nextAppointment: string;
  tasks: PatientTask[];
  notes: string;
  surgeryDate: string;
  surgeryDocument: SurgeryPlanDocument | null;
  medications: MedicationPlan[];
  diet: DietItem[];
  calendarEvents: CalendarEvent[];
}

export interface DoctorDashboardData {
  doctorName: string;
  title: string;
  activePatients: number;
  needsIntervention: number;
  patients: DoctorPatientSummary[];
}

export interface CalendarMonthDetails {
  monthLabel: string;
  events: CalendarEvent[];
}
