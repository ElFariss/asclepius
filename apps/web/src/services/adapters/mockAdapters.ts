import {
  doctorDashboardFixture,
  inviteFixture,
  patientDetailsFixture,
  patientFixture,
  patientTasksFixture,
  progressSeries,
  protocolsFixture,
} from "@/services/fixtures/data";
import type { AuthGateway, DoctorGateway, PatientGateway } from "@/services/gateways/contracts";
import type { AuthFormPayload, AuthSession, PatientTask } from "@/types/domain";

const delay = async (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

let taskState: PatientTask[] = [...patientTasksFixture];

const makeSession = (role: AuthSession["role"], payload: AuthFormPayload): AuthSession => ({
  role,
  email: payload.email,
  displayName:
    role === "doctor"
      ? "Dr. Andi Setiawan"
      : `${payload.firstName ?? "Budi"} ${payload.lastName ?? "Santoso"}`.trim(),
  consentAccepted: false,
  patientStage: role === "patient" ? "invite" : "dashboard",
});

export const authGateway: AuthGateway = {
  async login(role, payload) {
    await delay();
    return makeSession(role, payload);
  },
  async register(role, payload) {
    await delay();
    return makeSession(role, payload);
  },
  async logout() {
    await delay(60);
  },
};

export const patientGateway: PatientGateway = {
  async getInvite() {
    await delay();
    return inviteFixture;
  },
  async getPatient() {
    await delay();
    return patientFixture;
  },
  async getTasks() {
    await delay();
    return [...taskState];
  },
  async updateTask(taskId, completed) {
    await delay();
    taskState = taskState.map((task) => (task.id === taskId ? { ...task, completed } : task));
    return [...taskState];
  },
  async getProgress() {
    await delay();
    return progressSeries;
  },
};

export const doctorGateway: DoctorGateway = {
  async getDashboard() {
    await delay();
    return doctorDashboardFixture;
  },
  async getPatient(patientId) {
    await delay();
    return patientDetailsFixture[patientId] ?? patientDetailsFixture.p1;
  },
  async getProtocols() {
    await delay();
    return protocolsFixture;
  },
  async createPatientInvitation() {
    await delay();
    return { patientId: "p-new" };
  },
};
