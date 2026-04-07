import type {
  AuthFormPayload,
  AuthSession,
  CalendarMonthDetails,
  CarePlanDraft,
  DoctorDashboardData,
  MedicationPlan,
  Patient,
  PatientDetail,
  PatientInvite,
  PatientLookupRecord,
  PatientTask,
  ProgressPoint,
  SleepSummary,
  DietItem,
} from "@/types/domain";

export interface AuthGateway {
  login(role: AuthSession["role"], payload: AuthFormPayload): Promise<AuthSession>;
  register(role: AuthSession["role"], payload: AuthFormPayload): Promise<AuthSession>;
  logout(): Promise<void>;
}

export interface PatientGateway {
  getPendingInvite(patientId: string): Promise<PatientInvite>;
  acceptInvite(patientId: string): Promise<void>;
  getPatient(patientId: string): Promise<Patient>;
  getTasks(patientId: string): Promise<PatientTask[]>;
  updateTask(patientId: string, taskId: string, completed: boolean): Promise<PatientTask[]>;
  getProgress(patientId: string): Promise<ProgressPoint[]>;
  getMedicationPlan(patientId: string): Promise<MedicationPlan[]>;
  getDietPlan(patientId: string): Promise<DietItem[]>;
  getCalendarEvents(patientId: string): Promise<CalendarMonthDetails>;
  getSleepSummary(patientId: string): Promise<SleepSummary>;
}

export interface DoctorGateway {
  getDashboard(): Promise<DoctorDashboardData>;
  listDoctorPatients(): Promise<DoctorDashboardData["patients"]>;
  getPatient(patientId: string): Promise<PatientDetail>;
  lookupPatientById(patientId: string): Promise<PatientLookupRecord | null>;
  saveDraftCarePlan(payload: CarePlanDraft): Promise<CarePlanDraft>;
  finalizePendingInvite(payload: CarePlanDraft): Promise<{ inviteId: string; patientId: string }>;
}
