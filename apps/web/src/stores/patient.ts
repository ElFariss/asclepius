import { computed, ref } from "vue";
import { defineStore } from "pinia";

import { patientGateway } from "@/services/adapters/mockAdapters";
import type { Patient, PatientInvite, PatientTask, ProgressPoint } from "@/types/domain";

export const usePatientStore = defineStore("patient", () => {
  const invite = ref<PatientInvite | null>(null);
  const profile = ref<Patient | null>(null);
  const tasks = ref<PatientTask[]>([]);
  const progress = ref<ProgressPoint[]>([]);
  const loading = ref(false);

  const completedCount = computed(() => tasks.value.filter((task) => task.completed).length);

  const loadInvite = async () => {
    invite.value = await patientGateway.getInvite();
  };

  const loadDashboard = async () => {
    loading.value = true;
    try {
      const [patient, nextTasks, nextProgress] = await Promise.all([
        patientGateway.getPatient(),
        patientGateway.getTasks(),
        patientGateway.getProgress(),
      ]);
      profile.value = patient;
      tasks.value = nextTasks;
      progress.value = nextProgress;
    } finally {
      loading.value = false;
    }
  };

  const toggleTask = async (taskId: string) => {
    const current = tasks.value.find((task) => task.id === taskId);
    if (!current) {
      return;
    }

    tasks.value = await patientGateway.updateTask(taskId, !current.completed);
  };

  return {
    completedCount,
    invite,
    loadDashboard,
    loadInvite,
    loading,
    profile,
    progress,
    tasks,
    toggleTask,
  };
});
