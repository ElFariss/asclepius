import { computed, ref } from "vue";
import { defineStore } from "pinia";

import { authGateway, fileToUploadPayload, patientGateway, profileGateway } from "@/services/adapters/mockAdapters";
import { useThemeStore } from "@/stores/theme";
import type {
  AuthFormPayload,
  AuthSession,
  PatientJourneyStage,
  ThemeMode,
  UpdateProfilePayload,
  UploadAssetPayload,
  UserProfile,
  UserRole,
} from "@/types/domain";

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
  const profile = ref<UserProfile | null>(null);
  const hydrated = ref(Boolean(session.value));

  const isAuthenticated = computed(() => Boolean(session.value?.token));
  const role = computed<UserRole | null>(() => session.value?.role ?? null);
  const token = computed(() => session.value?.token ?? "");
  const userId = computed(() => session.value?.userId ?? "");
  const consentAccepted = computed(() => session.value?.consentAccepted ?? false);
  const patientStage = computed<PatientJourneyStage>(() => session.value?.patientStage ?? "empty");
  const displayName = computed(() => profile.value?.displayName ?? session.value?.displayName ?? "");
  const avatarUrl = computed(() => profile.value?.avatarUrl ?? session.value?.avatarUrl ?? "");

  const applyAppearance = (nextSession: AuthSession | null, nextProfile?: UserProfile | null) => {
    const themeStore = useThemeStore();
    const theme = nextProfile?.themeMode ?? nextSession?.themeMode;
    const accent = nextProfile?.accentColor ?? nextSession?.accentColor;
    if (theme && accent) {
      themeStore.hydrateFromProfile(theme, accent);
    }
  };

  const persist = (nextSession: AuthSession | null) => {
    session.value = nextSession;
    hydrated.value = true;
    writeSession(nextSession);
    applyAppearance(nextSession, profile.value);
  };

  const hydrate = async () => {
    if (hydrated.value) {
      applyAppearance(session.value, profile.value);
      return;
    }
    persist(readSession());
    if (session.value?.token) {
      await refreshProfile();
    }
  };

  const refreshProfile = async () => {
    if (!session.value?.token) {
      profile.value = null;
      return null;
    }
    const nextProfile = await profileGateway.getMe(session.value.token);
    profile.value = nextProfile;
    applyAppearance(session.value, nextProfile);
    return nextProfile;
  };

  const login = async (roleValue: UserRole, payload: AuthFormPayload) => {
    const nextSession = await authGateway.login(roleValue, payload);
    persist(nextSession);
    await refreshProfile();
  };

  const register = async (roleValue: UserRole, payload: AuthFormPayload) => {
    const nextSession = await authGateway.register(roleValue, payload);
    persist(nextSession);
    await refreshProfile();
  };

  const logout = async () => {
    if (session.value?.token) {
      await authGateway.logout(session.value.token);
    }
    profile.value = null;
    persist(null);
  };

  const advancePatientStage = async (stage: PatientJourneyStage) => {
    if (!session.value || session.value.role !== "patient") {
      return;
    }
    if (session.value.token) {
      await patientGateway.advanceStage(session.value.token, stage);
    }
    persist({
      ...session.value,
      patientStage: stage,
    });
  };

  const acceptConsent = async () => {
    if (!session.value || session.value.role !== "patient") {
      return;
    }
    if (session.value.token) {
      await patientGateway.acceptConsent(session.value.token);
    }
    persist({
      ...session.value,
      consentAccepted: true,
      patientStage: "dashboard",
    });
  };

  const updateProfile = async (payload: UpdateProfilePayload) => {
    if (!session.value?.token) {
      return null;
    }
    const nextProfile = await profileGateway.updateMe(session.value.token, payload);
    profile.value = nextProfile;
    persist({
      ...session.value,
      displayName: nextProfile.displayName,
      themeMode: nextProfile.themeMode,
      accentColor: nextProfile.accentColor,
    });
    return nextProfile;
  };

  const uploadAvatar = async (file: File | UploadAssetPayload) => {
    if (!session.value?.token) {
      return null;
    }
    const payload = file instanceof File ? await fileToUploadPayload(file) : file;
    const nextProfile = await profileGateway.uploadAvatar(session.value.token, payload);
    profile.value = nextProfile;
    persist({
      ...session.value,
      avatarUrl: nextProfile.avatarUrl,
    });
    return nextProfile;
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
    acceptConsent,
    advancePatientStage,
    avatarUrl,
    consentAccepted,
    defaultHomeRoute,
    displayName,
    hydrate,
    hydrated,
    isAuthenticated,
    login,
    logout,
    patientStage,
    profile,
    refreshProfile,
    register,
    role,
    session,
    token,
    updateProfile,
    uploadAvatar,
    userId,
  };
});
