import type {
  AuthFormPayload,
  AuthSession,
  CalendarEventCreatePayload,
  CalendarViewData,
  CarePlanDraft,
  DoctorDashboardData,
  DietItem,
  MedicationPlan,
  Patient,
  PatientDetail,
  PatientInvite,
  PatientLookupRecord,
  PatientTask,
  ProgressPoint,
  SleepSummary,
  SurgeryDecision,
  UploadAssetPayload,
  UpdateProfilePayload,
  UserProfile,
} from "@/types/domain";

export interface AuthGateway {
  login(role: AuthSession["role"], payload: AuthFormPayload): Promise<AuthSession>;
  register(role: AuthSession["role"], payload: AuthFormPayload): Promise<AuthSession>;
  logout(token: string): Promise<void>;
}

export interface ProfileGateway {
  getMe(token: string): Promise<UserProfile>;
  updateMe(token: string, payload: UpdateProfilePayload): Promise<UserProfile>;
  uploadAvatar(token: string, payload: UploadAssetPayload): Promise<UserProfile>;
}

export interface PatientGateway {
  getPendingInvite(token: string): Promise<PatientInvite | null>;
  acceptInvite(token: string): Promise<void>;
  getPatient(token: string): Promise<Patient>;
  getTasks(token: string): Promise<PatientTask[]>;
  updateTask(token: string, taskId: string, completed: boolean): Promise<PatientTask[]>;
  getProgress(token: string): Promise<ProgressPoint[]>;
  getMedicationPlan(token: string): Promise<MedicationPlan[]>;
  getDietPlan(token: string): Promise<DietItem[]>;
  getCalendarEvents(token: string, year?: number, month?: number): Promise<CalendarViewData>;
  getSleepSummary(token: string): Promise<SleepSummary>;
  advanceStage(token: string, stage: string): Promise<void>;
  acceptConsent(token: string): Promise<void>;
}

export interface DoctorGateway {
  getDashboard(token: string): Promise<DoctorDashboardData>;
  getPatient(token: string, patientId: string): Promise<PatientDetail>;
  lookupPatientById(token: string, patientId: string): Promise<PatientLookupRecord | null>;
  finalizePendingInvite(token: string, payload: CarePlanDraft): Promise<void>;
  getPatientCalendar(token: string, patientId: string, year?: number): Promise<CalendarViewData>;
  createCalendarEvent(token: string, patientId: string, payload: CalendarEventCreatePayload): Promise<void>;
  setSurgeryDecision(token: string, patientId: string, decision: SurgeryDecision): Promise<void>;
}
