<template>
  <div
    v-if="doctorStore.dashboard"
    class="flex h-full flex-col bg-slate-50"
  >
    <div class="rounded-b-[3rem] border-b border-slate-100 bg-white p-6 pb-8 shadow-sm">
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 overflow-hidden rounded-full border-2 border-blue-100">
            <img
              alt="Doctor"
              class="h-full w-full object-cover"
              src="https://picsum.photos/seed/doctor/100/100"
            />
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase text-slate-400">Good Morning</p>
            <p class="page-title font-bold text-slate-900">Dr. {{ doctorStore.dashboard.doctorName }}</p>
          </div>
        </div>
        <button
          class="p-2 text-slate-400 transition-colors hover:text-red-500"
          type="button"
          @click="logout"
        >
          <LogOut :size="20" />
        </button>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="rounded-2xl bg-blue-600 p-4 text-white shadow-lg shadow-blue-200">
          <Users
            :size="20"
            class="mb-2 opacity-60"
          />
          <p class="page-title text-2xl font-bold">{{ doctorStore.dashboard.activePatients }}</p>
          <p class="text-[10px] font-bold uppercase opacity-80">Active Patients</p>
        </div>
        <div class="rounded-2xl border border-yellow-100 bg-yellow-50 p-4 shadow-sm">
          <AlertCircle
            :size="20"
            class="mb-2 text-yellow-600"
          />
          <p class="page-title text-2xl font-bold text-slate-900">{{ doctorStore.dashboard.needsIntervention }}</p>
          <p class="text-[10px] font-bold uppercase text-yellow-700">Needs Intervention</p>
        </div>
      </div>
    </div>

    <div class="flex-1 space-y-6 overflow-y-auto p-6">
      <div class="flex items-center justify-between">
        <h3 class="page-title text-lg font-bold">Patient List</h3>
        <button
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-100"
          type="button"
          @click="router.push('/doctor/patients/new')"
        >
          <Plus :size="20" />
        </button>
      </div>

      <div class="relative mb-4">
        <Search
          class="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
          :size="16"
        />
        <input
          v-model="query"
          class="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Search name or procedure..."
          type="search"
        />
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <button
          v-for="patient in filteredPatients"
          :key="patient.id"
          class="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
          type="button"
          @click="router.push(`/doctor/patients/${patient.id}`)"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white"
              :class="patient.risk === 'High' ? 'bg-red-500' : patient.risk === 'Medium' ? 'bg-yellow-500' : 'bg-blue-600'"
            >
              {{ patient.riskScore }}
            </div>
            <div>
              <p class="text-sm font-bold text-slate-900">{{ patient.name }}</p>
              <p class="text-[10px] font-medium text-slate-400">{{ patient.procedure }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs font-bold text-slate-900">{{ patient.compliance }}%</p>
            <p
              class="rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider"
              :class="patient.inviteStatus === 'pending-acceptance'
                ? 'pending-pill'
                : patient.risk === 'High'
                  ? 'bg-red-50 text-red-500'
                  : patient.risk === 'Medium'
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'theme-accent-soft'"
            >
              {{ patient.status }}
            </p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { AlertCircle, LogOut, Plus, Search, Users } from "lucide-vue-next";

import { useDoctorStore } from "@/stores/doctor";
import { useSessionStore } from "@/stores/session";

const doctorStore = useDoctorStore();
const router = useRouter();
const sessionStore = useSessionStore();
const query = ref("");

const filteredPatients = computed(() =>
  doctorStore.dashboard?.patients.filter((patient) => {
    const haystack = `${patient.name} ${patient.procedure}`.toLowerCase();
    return haystack.includes(query.value.toLowerCase());
  }) ?? [],
);

const logout = async () => {
  await sessionStore.logout();
  await router.push("/doctor/login");
};

onMounted(async () => {
  if (!doctorStore.dashboard) {
    await doctorStore.loadDashboard();
  }
});
</script>
