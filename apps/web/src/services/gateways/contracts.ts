import type {
  AuthFormPayload,
  AuthSession,
  DoctorDashboardData,
  Patient,
  PatientDetail,
  PatientInvite,
  PatientTask,
  ProgressPoint,
  Protocol,
} from "@/types/domain";

export interface AuthGateway {
  login(role: AuthSession["role"], payload: AuthFormPayload): Promise<AuthSession>;
  register(role: AuthSession["role"], payload: AuthFormPayload): Promise<AuthSession>;
  logout(): Promise<void>;
}

export interface PatientGateway {
  getInvite(): Promise<PatientInvite>;
  getPatient(): Promise<Patient>;
  getTasks(): Promise<PatientTask[]>;
  updateTask(taskId: string, completed: boolean): Promise<PatientTask[]>;
  getProgress(): Promise<ProgressPoint[]>;
}

export interface DoctorGateway {
  getDashboard(): Promise<DoctorDashboardData>;
  getPatient(patientId: string): Promise<PatientDetail>;
  getProtocols(): Promise<Protocol[]>;
  createPatientInvitation(payload: {
    name: string;
    medicalRecordNumber: string;
    surgeryDate: string;
    protocolId: string;
  }): Promise<{ patientId: string }>;
}
