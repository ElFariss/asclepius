import { computed, ref } from "vue";
import { defineStore } from "pinia";

import { patientGateway } from "@/services/adapters/mockAdapters";
import { useSessionStore } from "@/stores/session";
import type {
  CalendarMonthDetails,
  DietItem,
  MedicationPlan,
  Patient,
  PatientInvite,
  PatientTask,
  ProgressPoint,
  SleepSummary,
} from "@/types/domain";

export const usePatientStore = defineStore("patient", () => {
  const invite = ref<PatientInvite | null>(null);
  const profile = ref<Patient | null>(null);
  const tasks = ref<PatientTask[]>([]);
  const progress = ref<ProgressPoint[]>([]);
  const medications = ref<MedicationPlan[]>([]);
  const diet = ref<DietItem[]>([]);
  const calendar = ref<CalendarMonthDetails | null>(null);
  const sleep = ref<SleepSummary | null>(null);
  const loading = ref(false);

  const currentPatientId = () => useSessionStore().userId || "p1";

  const completedCount = computed(() => tasks.value.filter((task) => task.completed).length);
  const hasPendingInvite = computed(() => Boolean(invite.value?.hasPendingUpdate));

  const loadInvite = async () => {
    invite.value = await patientGateway.getPendingInvite(currentPatientId());
  };

  const loadDashboard = async () => {
    loading.value = true;
    try {
      const patientId = currentPatientId();
      const [patient, nextTasks, nextProgress, nextMedications, nextDiet, nextCalendar, nextSleep] = await Promise.all([
        patientGateway.getPatient(patientId),
        patientGateway.getTasks(patientId),
        patientGateway.getProgress(patientId),
        patientGateway.getMedicationPlan(patientId),
        patientGateway.getDietPlan(patientId),
        patientGateway.getCalendarEvents(patientId),
        patientGateway.getSleepSummary(patientId),
      ]);
      profile.value = patient;
      tasks.value = nextTasks;
      progress.value = nextProgress;
      medications.value = nextMedications;
      diet.value = nextDiet;
      calendar.value = nextCalendar;
      sleep.value = nextSleep;
    } finally {
      loading.value = false;
    }
  };

  const acceptInvite = async () => {
    await patientGateway.acceptInvite(currentPatientId());
    await Promise.all([loadInvite(), loadDashboard()]);
  };

  const toggleTask = async (taskId: string) => {
    const current = tasks.value.find((task) => task.id === taskId);
    if (!current) {
      return;
    }

    tasks.value = await patientGateway.updateTask(currentPatientId(), taskId, !current.completed);
  };

  return {
    acceptInvite,
    calendar,
    completedCount,
    diet,
    hasPendingInvite,
    invite,
    loadDashboard,
    loadInvite,
    loading,
    medications,
    profile,
    progress,
    sleep,
    tasks,
    toggleTask,
  };
});
