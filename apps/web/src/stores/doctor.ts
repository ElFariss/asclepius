import { ref } from "vue";
import { defineStore } from "pinia";

import { doctorGateway } from "@/services/adapters/mockAdapters";
import { useSessionStore } from "@/stores/session";
import type {
  CalendarEventCreatePayload,
  CalendarViewData,
  CarePlanDraft,
  DoctorDashboardData,
  PatientDetail,
  PatientLookupRecord,
  SurgeryDecision,
} from "@/types/domain";

const emptyDraft = (): CarePlanDraft => ({
  patientId: "",
  surgeryDate: "",
  surgeryDocument: null,
  medications: [],
  diet: [],
});

export const useDoctorStore = defineStore("doctor", () => {
  const dashboard = ref<DoctorDashboardData | null>(null);
  const currentPatient = ref<PatientDetail | null>(null);
  const currentCalendar = ref<CalendarViewData | null>(null);
  const lookupResult = ref<PatientLookupRecord | null>(null);
  const currentDraft = ref<CarePlanDraft>(emptyDraft());
  const loading = ref(false);

  const sessionStore = useSessionStore();
  const currentToken = () => sessionStore.token;

  const loadDashboard = async () => {
    if (!currentToken()) {
      return;
    }
    dashboard.value = await doctorGateway.getDashboard(currentToken());
  };

  const loadPatient = async (patientId: string) => {
    if (!currentToken()) {
      return;
    }
    loading.value = true;
    try {
      currentPatient.value = await doctorGateway.getPatient(currentToken(), patientId);
    } finally {
      loading.value = false;
    }
  };

  const loadPatientCalendar = async (patientId: string, year?: number) => {
    if (!currentToken()) {
      return;
    }
    currentCalendar.value = await doctorGateway.getPatientCalendar(currentToken(), patientId, year);
  };

  const lookupPatient = async (patientId: string) => {
    if (!currentToken()) {
      lookupResult.value = null;
      return null;
    }
    lookupResult.value = await doctorGateway.lookupPatientById(currentToken(), patientId);
    return lookupResult.value;
  };

  const setDraft = (draft: Partial<CarePlanDraft>) => {
    currentDraft.value = {
      ...currentDraft.value,
      ...draft,
    };
  };

  const resetDraft = () => {
    currentDraft.value = emptyDraft();
    lookupResult.value = null;
  };

  const finalizePendingInvite = async () => {
    if (!currentToken()) {
      return;
    }
    await doctorGateway.finalizePendingInvite(currentToken(), currentDraft.value);
    await loadDashboard();
  };

  const createCalendarEvent = async (patientId: string, payload: CalendarEventCreatePayload) => {
    if (!currentToken()) {
      return;
    }
    await doctorGateway.createCalendarEvent(currentToken(), patientId, payload);
    await loadPatientCalendar(patientId, currentCalendar.value?.year);
    await loadPatient(patientId);
  };

  const setSurgeryDecision = async (patientId: string, currentDecision: SurgeryDecision, nextDecision: SurgeryDecision) => {
    if (!currentToken()) {
      return;
    }
    const resolved = currentDecision === nextDecision ? "none" : nextDecision;
    await doctorGateway.setSurgeryDecision(currentToken(), patientId, resolved);
    if (currentPatient.value?.id === patientId) {
      currentPatient.value = {
        ...currentPatient.value,
        surgeryDecision: resolved,
      };
    }
  };

  const reset = () => {
    dashboard.value = null;
    currentPatient.value = null;
    currentCalendar.value = null;
    lookupResult.value = null;
    currentDraft.value = emptyDraft();
  };

  return {
    createCalendarEvent,
    currentCalendar,
    currentDraft,
    currentPatient,
    dashboard,
    finalizePendingInvite,
    loadDashboard,
    loadPatient,
    loadPatientCalendar,
    loading,
    lookupPatient,
    lookupResult,
    reset,
    resetDraft,
    setDraft,
    setSurgeryDecision,
  };
});
