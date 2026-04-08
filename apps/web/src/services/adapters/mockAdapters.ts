import type {
  AuthGateway,
  DoctorGateway,
  PatientGateway,
  ProfileGateway,
} from "@/services/gateways/contracts";
import { request } from "@/services/http/client";
import type {
  AuthFormPayload,
  AuthSession,
  CalendarEventCreatePayload,
  CarePlanDraft,
  PatientInvite,
  SurgeryDecision,
  UploadAssetPayload,
  UpdateProfilePayload,
  UserProfile,
} from "@/types/domain";

export const authGateway: AuthGateway = {
  async login(role, payload) {
    const response = await request<{ token: string; session: AuthSession }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response.session;
  },
  async register(role, payload) {
    const response = await request<{ token: string; session: AuthSession }>(`/api/auth/register?role=${role}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response.session;
  },
  async logout(token) {
    await request<void>("/api/auth/logout", {
      method: "POST",
      token,
    });
  },
};

export const profileGateway: ProfileGateway = {
  async getMe(token) {
    return request<UserProfile>("/api/me", { token });
  },
  async updateMe(token, payload) {
    return request<UserProfile>("/api/me", {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    });
  },
  async uploadAvatar(token, payload) {
    return request<UserProfile>("/api/me/avatar", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    });
  },
};

export const patientGateway: PatientGateway = {
  async getPendingInvite(token) {
    const response = await request<{ invite: PatientInvite | null }>("/api/patient/invite", {
      token,
    });
    return response.invite ?? null;
  },
  async acceptInvite(token) {
    await request<void>("/api/patient/invite/accept", {
      method: "POST",
      token,
    });
  },
  async getPatient(token) {
    return request("/api/patient/profile", { token });
  },
  async getTasks(token) {
    return request("/api/patient/tasks", { token });
  },
  async updateTask(token, taskId, completed) {
    return request("/api/patient/tasks", {
      method: "PATCH",
      token,
      body: JSON.stringify({ taskId, completed }),
    });
  },
  async getProgress(token) {
    return request("/api/patient/progress", { token });
  },
  async getMedicationPlan(token) {
    return request("/api/patient/medicines", { token });
  },
  async getDietPlan(token) {
    return request("/api/patient/diet", { token });
  },
  async getCalendarEvents(token, year, month) {
    const query = new URLSearchParams();
    if (year) {
      query.set("year", String(year));
    }
    if (month) {
      query.set("month", String(month));
    }
    return request(`/api/patient/calendar${query.size ? `?${query.toString()}` : ""}`, { token });
  },
  async getSleepSummary(token) {
    return request("/api/patient/sleep", { token });
  },
  async advanceStage(token, stage) {
    await request<void>("/api/patient/stage", {
      method: "PATCH",
      token,
      body: JSON.stringify({ stage }),
    });
  },
  async acceptConsent(token) {
    await request<void>("/api/patient/consent", {
      method: "POST",
      token,
    });
  },
};

export const doctorGateway: DoctorGateway = {
  async getDashboard(token) {
    return request("/api/doctor/dashboard", { token });
  },
  async getPatient(token, patientId) {
    return request(`/api/doctor/patients/${patientId}`, { token });
  },
  async lookupPatientById(token, patientId) {
    try {
      return await request(`/api/doctor/patients/lookup/${patientId}`, { token });
    } catch {
      return null;
    }
  },
  async finalizePendingInvite(token, payload) {
    await request<void>("/api/doctor/patients/pending-care-plan", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    });
  },
  async getPatientCalendar(token, patientId, year) {
    const query = year ? `?year=${year}` : "";
    return request(`/api/doctor/patients/${patientId}/calendar${query}`, { token });
  },
  async createCalendarEvent(token, patientId, payload) {
    await request<void>(`/api/doctor/patients/${patientId}/calendar-events`, {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    });
  },
  async setSurgeryDecision(token, patientId, decision) {
    await request<void>(`/api/doctor/patients/${patientId}/surgery-decision`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ decision } satisfies { decision: SurgeryDecision }),
    });
  },
};

export const fileToUploadPayload = async (file: File): Promise<UploadAssetPayload> => {
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  return {
    name: file.name,
    mimeType: file.type,
    data,
  };
};

export type { CalendarEventCreatePayload, CarePlanDraft, UpdateProfilePayload, UserProfile };
