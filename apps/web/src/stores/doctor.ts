import { ref } from "vue";
import { defineStore } from "pinia";

import { doctorGateway } from "@/services/adapters/mockAdapters";
import type {
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
  const lookupResult = ref<PatientLookupRecord | null>(null);
  const currentDraft = ref<CarePlanDraft>(emptyDraft());
  const surgeryDecision = ref<SurgeryDecision>("none");
  const loading = ref(false);

  const loadDashboard = async () => {
    dashboard.value = await doctorGateway.getDashboard();
  };

  const loadPatient = async (patientId: string) => {
    loading.value = true;
    try {
      currentPatient.value = await doctorGateway.getPatient(patientId);
    } finally {
      loading.value = false;
    }
  };

  const lookupPatient = async (patientId: string) => {
    lookupResult.value = await doctorGateway.lookupPatientById(patientId);
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

  const saveDraft = async () => {
    currentDraft.value = await doctorGateway.saveDraftCarePlan(currentDraft.value);
    return currentDraft.value;
  };

  const finalizePendingInvite = async () => {
    const result = await doctorGateway.finalizePendingInvite(currentDraft.value);
    await loadDashboard();
    return result;
  };

  const setSurgeryDecision = (decision: SurgeryDecision) => {
    surgeryDecision.value = decision;
  };

  return {
    currentDraft,
    currentPatient,
    dashboard,
    finalizePendingInvite,
    loadDashboard,
    loadPatient,
    loading,
    lookupPatient,
    lookupResult,
    resetDraft,
    saveDraft,
    setDraft,
    setSurgeryDecision,
    surgeryDecision,
  };
});
