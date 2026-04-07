import { registry } from "@/services/adapters/mockRegistry";
import type { AuthGateway, DoctorGateway, PatientGateway } from "@/services/gateways/contracts";
import type { AuthFormPayload, AuthSession } from "@/types/domain";

const delay = async (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

const makeSession = (role: AuthSession["role"], payload: AuthFormPayload): AuthSession => {
  if (role === "doctor") {
    return {
      userId: "doctor-1",
      role,
      email: payload.email,
      displayName: "Dr. Andi Setiawan",
      consentAccepted: false,
      patientStage: "dashboard",
    };
  }

  const patient = registry.findPatientByEmail(payload.email);
  return {
    userId: patient.id,
    role,
    email: patient.email,
    displayName: patient.name,
    consentAccepted: false,
    patientStage: "empty",
  };
};

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
  async getPendingInvite(patientId) {
    await delay();
    return registry.getPatientInvite(patientId);
  },
  async acceptInvite(patientId) {
    await delay();
    registry.acceptInvite(patientId);
  },
  async getPatient(patientId) {
    await delay();
    return registry.getPatientProfile(patientId);
  },
  async getTasks(patientId) {
    await delay();
    return registry.getPatientTasks(patientId);
  },
  async updateTask(patientId, taskId, completed) {
    await delay();
    return registry.updateTask(patientId, taskId, completed);
  },
  async getProgress(patientId) {
    await delay();
    return registry.getProgress(patientId);
  },
  async getMedicationPlan(patientId) {
    await delay();
    return registry.getMedicationPlan(patientId);
  },
  async getDietPlan(patientId) {
    await delay();
    return registry.getDietPlan(patientId);
  },
  async getCalendarEvents(patientId) {
    await delay();
    return registry.getCalendarEvents(patientId);
  },
  async getSleepSummary(patientId) {
    await delay();
    return registry.getSleepSummary(patientId);
  },
};

export const doctorGateway: DoctorGateway = {
  async getDashboard() {
    await delay();
    return registry.getDoctorDashboard();
  },
  async listDoctorPatients() {
    await delay();
    return registry.getDoctorDashboard().patients;
  },
  async getPatient(patientId) {
    await delay();
    return registry.getPatientDetail(patientId);
  },
  async lookupPatientById(patientId) {
    await delay();
    return registry.lookupPatientById(patientId);
  },
  async saveDraftCarePlan(payload) {
    await delay();
    return registry.saveDraft(payload);
  },
  async finalizePendingInvite(payload) {
    await delay();
    return registry.finalizePendingInvite(payload);
  },
};
