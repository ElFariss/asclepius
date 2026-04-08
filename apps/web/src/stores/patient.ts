import { computed, ref } from "vue";
import { defineStore } from "pinia";

import { patientGateway } from "@/services/adapters/mockAdapters";
import { useSessionStore } from "@/stores/session";
import type {
  CalendarViewData,
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
  const calendar = ref<CalendarViewData | null>(null);
  const sleep = ref<SleepSummary | null>(null);
  const loading = ref(false);

  const sessionStore = useSessionStore();
  const currentToken = () => sessionStore.token;

  const completedCount = computed(() => tasks.value.filter((task) => task.completed).length);
  const hasPendingInvite = computed(() => Boolean(invite.value?.hasPendingUpdate));

  const loadInvite = async () => {
    if (!currentToken()) {
      invite.value = null;
      return;
    }
    invite.value = await patientGateway.getPendingInvite(currentToken());
  };

  const loadDashboard = async () => {
    if (!currentToken()) {
      return;
    }
    loading.value = true;
    try {
      const token = currentToken();
      const [patient, nextTasks, nextProgress, nextMedications, nextDiet, nextCalendar, nextSleep] = await Promise.all([
        patientGateway.getPatient(token),
        patientGateway.getTasks(token),
        patientGateway.getProgress(token),
        patientGateway.getMedicationPlan(token),
        patientGateway.getDietPlan(token),
        patientGateway.getCalendarEvents(token),
        patientGateway.getSleepSummary(token),
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

  const loadCalendar = async (year?: number, month?: number) => {
    if (!currentToken()) {
      return;
    }
    calendar.value = await patientGateway.getCalendarEvents(currentToken(), year, month);
  };

  const acceptInvite = async () => {
    if (!currentToken()) {
      return;
    }
    await patientGateway.acceptInvite(currentToken());
    await Promise.all([loadInvite(), loadDashboard()]);
  };

  const toggleTask = async (taskId: string) => {
    const current = tasks.value.find((task) => task.id === taskId);
    if (!current || !currentToken()) {
      return;
    }

    tasks.value = await patientGateway.updateTask(currentToken(), taskId, !current.completed);
  };

  const reset = () => {
    invite.value = null;
    profile.value = null;
    tasks.value = [];
    progress.value = [];
    medications.value = [];
    diet.value = [];
    calendar.value = null;
    sleep.value = null;
  };

  return {
    acceptInvite,
    calendar,
    completedCount,
    diet,
    hasPendingInvite,
    invite,
    loadCalendar,
    loadDashboard,
    loadInvite,
    loading,
    medications,
    profile,
    progress,
    reset,
    sleep,
    tasks,
    toggleTask,
  };
});
