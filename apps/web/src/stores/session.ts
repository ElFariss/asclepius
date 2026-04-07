import { computed, ref } from "vue";
import { defineStore } from "pinia";

import { authGateway } from "@/services/adapters/mockAdapters";
import type { AuthFormPayload, AuthSession, PatientJourneyStage, UserRole } from "@/types/domain";

const SESSION_STORAGE_KEY = "asclepius-session";

const readSession = (): AuthSession | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as AuthSession) : null;
};

const writeSession = (session: AuthSession | null) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!session) {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const useSessionStore = defineStore("session", () => {
  const session = ref<AuthSession | null>(readSession());
  const hydrated = ref(Boolean(session.value));

  const isAuthenticated = computed(() => Boolean(session.value));
  const role = computed<UserRole | null>(() => session.value?.role ?? null);
  const consentAccepted = computed(() => session.value?.consentAccepted ?? false);
  const patientStage = computed<PatientJourneyStage>(() => session.value?.patientStage ?? "invite");
  const displayName = computed(() => session.value?.displayName ?? "");

  const persist = (nextSession: AuthSession | null) => {
    session.value = nextSession;
    hydrated.value = true;
    writeSession(nextSession);
  };

  const hydrate = () => {
    if (hydrated.value) {
      return;
    }
    persist(readSession());
  };

  const login = async (roleValue: UserRole, payload: AuthFormPayload) => {
    persist(await authGateway.login(roleValue, payload));
  };

  const register = async (roleValue: UserRole, payload: AuthFormPayload) => {
    persist(await authGateway.register(roleValue, payload));
  };

  const logout = async () => {
    await authGateway.logout();
    persist(null);
  };

  const advancePatientStage = (stage: PatientJourneyStage) => {
    if (!session.value || session.value.role !== "patient") {
      return;
    }
    persist({
      ...session.value,
      patientStage: stage,
    });
  };

  const acceptConsent = () => {
    if (!session.value || session.value.role !== "patient") {
      return;
    }
    persist({
      ...session.value,
      consentAccepted: true,
      patientStage: "dashboard",
    });
  };

  const defaultHomeRoute = computed(() => {
    if (!session.value) {
      return "/patient/login";
    }

    if (session.value.role === "doctor") {
      return "/doctor/dashboard";
    }

    if (session.value.consentAccepted) {
      return "/patient/dashboard";
    }

    return `/patient/${session.value.patientStage}`;
  });

  return {
    consentAccepted,
    defaultHomeRoute,
    displayName,
    hydrate,
    isAuthenticated,
    login,
    logout,
    patientStage,
    register,
    role,
    session,
    acceptConsent,
    advancePatientStage,
  };
});
