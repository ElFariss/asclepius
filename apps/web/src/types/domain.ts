export type UserRole = "patient" | "doctor";
export type RiskLevel = "Low" | "Medium" | "High";
export type TaskCategory = "medication" | "exercise" | "nutrition";
export type PatientJourneyStage = "invite" | "surgery" | "consent" | "dashboard";
export type SurgeryDecision = "none" | "go" | "no-go";

export interface AuthFormPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  licenseNumber?: string;
}

export interface AuthSession {
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

export interface PatientInvite {
  doctorName: string;
  specialty: string;
  procedure: string;
  surgeryDate: string;
}

export interface Patient {
  id: string;
  name: string;
  procedure: string;
  compliance: number;
  risk: RiskLevel;
  riskScore: number;
  status: string;
  surgeryDate: string;
  daysUntilSurgery: number;
  attendingDoctor: string;
  specialty: string;
  hospitalStay: string;
  surgeryDuration: string;
  lastConsultation: string;
  streak: number;
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
}

export interface PatientDetail extends DoctorPatientSummary {
  nextAppointment: string;
  tasks: PatientTask[];
  notes: string;
}

export interface Protocol {
  id: string;
  name: string;
  category: string;
  tasks: number;
}

export interface DoctorDashboardData {
  doctorName: string;
  title: string;
  activePatients: number;
  needsIntervention: number;
  patients: DoctorPatientSummary[];
}
