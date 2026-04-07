import { ref } from "vue";
import { defineStore } from "pinia";

import { doctorGateway } from "@/services/adapters/mockAdapters";
import type { DoctorDashboardData, PatientDetail, Protocol, SurgeryDecision } from "@/types/domain";

export const useDoctorStore = defineStore("doctor", () => {
  const dashboard = ref<DoctorDashboardData | null>(null);
  const currentPatient = ref<PatientDetail | null>(null);
  const protocols = ref<Protocol[]>([]);
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

  const loadProtocols = async () => {
    protocols.value = await doctorGateway.getProtocols();
  };

  const setSurgeryDecision = (decision: SurgeryDecision) => {
    surgeryDecision.value = decision;
  };

  const createPatientInvitation = async (payload: {
    name: string;
    medicalRecordNumber: string;
    surgeryDate: string;
    protocolId: string;
  }) => doctorGateway.createPatientInvitation(payload);

  return {
    createPatientInvitation,
    currentPatient,
    dashboard,
    loadDashboard,
    loadPatient,
    loadProtocols,
    loading,
    protocols,
    setSurgeryDecision,
    surgeryDecision,
  };
});
