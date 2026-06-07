import type {
  AuthFormPayload,
  AuthSession,
  ChatMessage,
  ChatMessageCreatePayload,
  ChatThread,
  CalendarEventCreatePayload,
  CalendarViewData,
  CarePlanDraft,
  DemoSessionPayload,
  DoctorDashboardData,
  DietItem,
  LatestCheckup,
  MedicationPlan,
  Patient,
  PatientDetail,
  PatientInvite,
  PatientLookupRecord,
  PatientTask,
  ProgressPoint,
  RiskScoreCreatePayload,
  RiskScoreEntry,
  SleepSummary,
  SurgeryDecision,
  UploadAssetPayload,
  UpdateProfilePayload,
  UserProfile,
} from "@/types/domain";

export interface AuthGateway {
  login(role: AuthSession["role"], payload: AuthFormPayload): Promise<AuthSession>;
  register(role: AuthSession["role"], payload: AuthFormPayload): Promise<AuthSession>;
  createDemoSession(payload: DemoSessionPayload): Promise<AuthSession>;
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
  getChat(token: string): Promise<ChatThread>;
  sendChat(token: string, payload: ChatMessageCreatePayload): Promise<ChatMessage>;
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
  getChat(token: string, patientId: string): Promise<ChatThread>;
  sendChat(token: string, patientId: string, payload: ChatMessageCreatePayload): Promise<ChatMessage>;
  getRiskScores(token: string, patientId: string): Promise<RiskScoreEntry[]>;
  createRiskScore(token: string, patientId: string, payload: RiskScoreCreatePayload): Promise<void>;
  getLatestCheckup(token: string, patientId: string): Promise<LatestCheckup>;
  updateLatestCheckup(token: string, patientId: string, payload: LatestCheckup): Promise<LatestCheckup>;
  setSurgeryDecision(token: string, patientId: string, decision: SurgeryDecision): Promise<void>;
}
