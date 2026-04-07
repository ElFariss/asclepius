<template>
  <div
    v-if="patientStore.profile"
    class="flex h-full flex-col bg-slate-50"
  >
    <div class="rounded-b-[3rem] border-b border-slate-100 bg-white p-6 pb-8 shadow-sm">
      <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="theme-accent-bg flex h-12 w-12 items-center justify-center rounded-2xl text-white">
            <User :size="24" />
          </div>
          <div>
            <p class="text-xs font-medium text-slate-400">Registered Patient</p>
            <p class="page-title font-bold text-slate-900">{{ patientStore.profile.name }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors"
            :class="isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            type="button"
            @click="isOnline = !isOnline"
          >
            <div
              class="h-1.5 w-1.5 rounded-full"
              :class="isOnline ? 'bg-green-500' : 'bg-red-500'"
            />
            {{ isOnline ? "Online" : "Offline" }}
          </button>
          <button
            class="p-2 text-slate-400 transition-colors hover:text-red-500"
            type="button"
            @click="logout"
          >
            <LogOut :size="18" />
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <div class="flex items-end justify-between">
          <div>
            <h2 class="page-title text-3xl font-bold text-slate-900">{{ patientStore.profile.daysUntilSurgery }} Days</h2>
            <p class="text-sm text-slate-500">Until Your Surgery</p>
          </div>
          <div class="text-right">
            <p class="mb-1 text-xs font-bold theme-accent-text">Compliance</p>
            <p class="page-title text-xl font-bold text-slate-900">{{ patientStore.profile.compliance }}%</p>
          </div>
        </div>

        <div class="-mx-2 h-48 w-full">
          <TrendChart
            :labels="labels"
            :values="compliance"
            color="var(--theme-primary)"
          />
        </div>
      </div>
    </div>

    <div class="-mt-6 space-y-4 p-6">
      <div class="grid gap-4 md:grid-cols-2">
        <section class="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-slate-500">Medicine</p>
              <p class="mt-1 text-sm font-bold text-slate-900">{{ patientStore.medications.length }} drugs scheduled</p>
            </div>
            <Pill class="theme-accent-text" :size="22" />
          </div>

          <div class="space-y-3">
            <button
              v-for="medication in patientStore.medications"
              :key="medication.id"
              class="theme-accent-soft w-full rounded-[1.5rem] p-4 text-left"
              type="button"
              @click="selectedMedication = medication"
            >
              <p class="font-semibold text-slate-900">{{ medication.name }}</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">{{ truncateWords(medication.description, 12) }}</p>
            </button>
          </div>
        </section>

        <section class="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-slate-500">Diet</p>
              <p class="mt-1 text-sm font-bold text-slate-900">{{ patientStore.diet.length }} food rules</p>
            </div>
            <Utensils class="theme-accent-text" :size="22" />
          </div>

          <div class="space-y-3">
            <div
              v-for="dietItem in sortedDiet"
              :key="dietItem.id"
              class="rounded-[1.5rem] px-4 py-3"
              :class="dietClassName(dietItem.type)"
            >
              <p class="font-semibold">{{ dietItem.name }}</p>
              <p class="mt-1 text-xs font-bold uppercase tracking-[0.18em]">{{ dietItem.type.replace('-', ' ') }}</p>
            </div>
          </div>
        </section>
      </div>

      <button
        class="group flex w-full items-center justify-between rounded-[2rem] border border-slate-100 bg-white p-6 text-left shadow-xl shadow-slate-200/50"
        type="button"
        @click="router.push('/patient/checklist')"
      >
        <div class="flex items-center gap-4">
          <div class="theme-accent-soft flex h-14 w-14 items-center justify-center rounded-2xl">
            <ClipboardList :size="28" />
          </div>
          <div class="text-left">
            <h3 class="page-title font-bold text-slate-900">Daily Checklist</h3>
            <p class="text-xs text-slate-500">{{ patientStore.completedCount }} of {{ patientStore.tasks.length }} tasks completed today</p>
          </div>
        </div>
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <ChevronRight :size="20" />
        </div>
      </button>

      <div class="grid gap-4 md:grid-cols-2">
        <button
          class="rounded-[2rem] border border-slate-100 bg-white p-5 text-left shadow-sm"
          type="button"
          @click="router.push('/patient/calendar')"
        >
          <CalendarDays class="theme-accent-text mb-3" :size="24" />
          <p class="text-xs font-medium text-slate-500">Calendar</p>
          <p class="text-sm font-bold text-slate-900">{{ patientStore.calendar?.monthLabel }}</p>
          <p class="mt-2 text-xs text-slate-500">{{ patientStore.calendar?.events.length ?? 0 }} scheduled items this month</p>
        </button>
        <button
          class="rounded-[2rem] border border-slate-100 bg-white p-5 text-left shadow-sm"
          type="button"
          @click="router.push('/patient/sleep')"
        >
          <MoonStar class="mb-3" :class="patientStore.sleep?.meetsTarget ? 'text-emerald-600' : 'text-rose-600'" :size="24" />
          <p class="text-xs font-medium text-slate-500">Sleep</p>
          <p class="text-sm font-bold text-slate-900">{{ sleepAverage }}</p>
          <p class="mt-2 text-xs" :class="patientStore.sleep?.meetsTarget ? 'text-emerald-600' : 'text-rose-600'">
            Target is 7 hours
          </p>
        </button>
      </div>
    </div>

    <ModalShell
      :description="selectedMedication ? formatCountdown(selectedMedication.schedule.nextDoseAt) : ''"
      :open="Boolean(selectedMedication)"
      title="Medicine details"
      @close="selectedMedication = null"
    >
      <div
        v-if="selectedMedication"
        class="space-y-4 p-6"
      >
        <div>
          <p class="page-title text-xl font-bold text-slate-900">{{ selectedMedication.name }}</p>
          <p class="mt-2 text-sm leading-7 text-slate-600">{{ selectedMedication.description }}</p>
        </div>
        <div class="grid gap-4 rounded-[1.5rem] bg-slate-50 p-4 md:grid-cols-2">
          <div>
            <p class="eyebrow">Dose</p>
            <p class="mt-2 text-sm font-semibold text-slate-900">{{ selectedMedication.schedule.amount }}</p>
          </div>
          <div>
            <p class="eyebrow">Frequency</p>
            <p class="mt-2 text-sm font-semibold text-slate-900">{{ selectedMedication.schedule.frequency }}</p>
          </div>
          <div>
            <p class="eyebrow">Meal timing</p>
            <p class="mt-2 text-sm font-semibold text-slate-900">
              {{ selectedMedication.schedule.mealTiming === "before-eating" ? "Before eating" : "After eating" }}
            </p>
          </div>
          <div>
            <p class="eyebrow">Next dose</p>
            <p class="mt-2 text-sm font-semibold theme-accent-text">{{ formatCountdown(selectedMedication.schedule.nextDoseAt) }}</p>
          </div>
        </div>
      </div>
    </ModalShell>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  CalendarDays,
  ChevronRight,
  ClipboardList,
  LogOut,
  MoonStar,
  Pill,
  User,
  Utensils,
} from "lucide-vue-next";

import TrendChart from "@/components/charts/TrendChart.vue";
import ModalShell from "@/components/ui/ModalShell.vue";
import { dietClassName, formatCountdown, sortDietItems, truncateWords } from "@/modules/shared/utils/carePlan";
import { usePatientStore } from "@/stores/patient";
import { useSessionStore } from "@/stores/session";
import type { MedicationPlan } from "@/types/domain";

const isOnline = ref(true);
const selectedMedication = ref<MedicationPlan | null>(null);
const patientStore = usePatientStore();
const router = useRouter();
const sessionStore = useSessionStore();

const labels = computed(() => patientStore.progress.map((point) => point.day));
const compliance = computed(() => patientStore.progress.map((point) => point.compliance));
const sortedDiet = computed(() => sortDietItems(patientStore.diet));
const sleepAverage = computed(() =>
  patientStore.sleep ? `${patientStore.sleep.averageHours.toFixed(1)} hours average` : "No sleep data",
);

const logout = async () => {
  await sessionStore.logout();
  await router.push("/patient/login");
};

onMounted(async () => {
  if (!patientStore.profile) {
    await patientStore.loadDashboard();
  }
});
</script>
