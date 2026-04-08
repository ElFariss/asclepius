<template>
  <div
    v-if="patientStore.profile"
    class="min-h-screen bg-[color:var(--surface-page)] px-4 py-6 md:px-8"
  >
    <div class="w-full space-y-6">
      <section class="overflow-hidden rounded-[2.2rem] bg-white px-6 py-6 shadow-2xl shadow-slate-200/60 md:px-8 md:py-8">
        <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="h-14 w-14 overflow-hidden rounded-2xl bg-slate-100">
              <img
                v-if="sessionStore.avatarUrl"
                :src="sessionStore.avatarUrl"
                alt="Patient profile"
                class="h-full w-full object-cover"
              />
              <div
                v-else
                class="theme-accent-bg flex h-full w-full items-center justify-center"
              >
                <User :size="24" />
              </div>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-400">Registered Patient</p>
              <p class="page-title font-bold text-slate-900">{{ patientStore.profile.name }}</p>
            </div>
          </div>

          <button
            class="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300"
            type="button"
            @click="router.push('/patient/settings')"
          >
            <Settings2 :size="18" />
          </button>
        </div>

        <div class="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div class="space-y-6">
            <div class="flex items-end justify-between">
              <div>
                <h2 class="page-title text-[2rem] font-bold text-slate-900">{{ patientStore.profile.daysUntilSurgery }} Days</h2>
                <p class="text-[13px] text-slate-500">Until Your Surgery</p>
              </div>
              <div class="text-right">
                <p class="mb-1 text-[10px] font-bold theme-accent-text">Compliance</p>
                <p class="page-title text-xl font-bold text-slate-900">{{ patientStore.profile.compliance }}%</p>
              </div>
            </div>

            <div class="h-48 w-full">
              <TrendChart
                :labels="labels"
                :values="compliance"
                color="var(--theme-primary)"
              />
            </div>
          </div>

          <div class="rounded-[1.9rem] bg-[color:var(--surface-subtle)] p-6">
            <p class="eyebrow">Upcoming</p>
            <div class="mt-4 space-y-4">
              <div class="rounded-[1.5rem] bg-white p-4">
                <p class="text-sm font-semibold text-slate-900">Procedure</p>
                <p class="mt-2 text-sm text-slate-500">{{ patientStore.profile.procedure }}</p>
              </div>
              <div class="rounded-[1.5rem] bg-white p-4">
                <p class="text-sm font-semibold text-slate-900">Next appointment</p>
                <p class="mt-2 text-sm text-slate-500">{{ patientStore.profile.nextAppointment }}</p>
              </div>
              <div class="rounded-[1.5rem] bg-white p-4">
                <p class="text-sm font-semibold text-slate-900">Doctor</p>
                <p class="mt-2 text-sm text-slate-500">{{ patientStore.profile.attendingDoctor }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-2 gap-3">
        <button
          class="rounded-[1.4rem] px-4 py-4 text-left text-white shadow-xl shadow-slate-200/60 transition hover:-translate-y-0.5"
          style="background: linear-gradient(135deg, var(--theme-primary), var(--theme-primary-deep));"
          type="button"
          @click="router.push('/patient/medicines')"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[10px] font-medium uppercase tracking-[0.16em] text-white/70">Medicine</p>
              <p class="mt-2 page-title text-xl font-bold">{{ patientStore.medications.length }}</p>
            </div>
            <Pill :size="24" />
          </div>
        </button>

        <button
          class="rounded-[1.4rem] bg-[color:var(--warning-accent)] px-4 py-4 text-left text-slate-900 shadow-xl shadow-yellow-200/60 transition hover:-translate-y-0.5"
          type="button"
          @click="router.push('/patient/diet')"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-700/70">Diet</p>
              <p class="mt-2 page-title text-xl font-bold">{{ patientStore.diet.length }}</p>
            </div>
            <Utensils :size="24" />
          </div>
        </button>
      </div>

      <button
        class="group flex w-full items-center justify-between rounded-[1.5rem] bg-white p-5 text-left shadow-xl shadow-slate-200/50"
        type="button"
        @click="router.push('/patient/checklist')"
      >
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-blue-50 text-blue-600">
            <ClipboardList :size="24" />
          </div>
          <div class="text-left">
            <h3 class="page-title text-base font-bold text-slate-900">Daily Checklist</h3>
            <p class="text-[11px] text-slate-500">{{ patientStore.completedCount }} of {{ patientStore.tasks.length }} tasks completed today</p>
          </div>
        </div>
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <ChevronRight :size="20" />
        </div>
      </button>

      <div class="grid grid-cols-2 gap-3">
        <button
          class="rounded-[1.4rem] bg-white p-4 text-left shadow-xl shadow-slate-200/50"
          type="button"
          @click="router.push('/patient/calendar')"
        >
          <CalendarDays class="theme-accent-text mb-3" :size="22" />
          <p class="text-[10px] font-medium text-slate-500">Calendar</p>
          <p class="mt-1 text-base font-bold text-slate-900">{{ patientStore.calendar?.label }}</p>
        </button>
        <button
          class="rounded-[1.4rem] bg-white p-4 text-left shadow-xl shadow-slate-200/50"
          type="button"
          @click="router.push('/patient/sleep')"
        >
          <MoonStar class="mb-3" :class="patientStore.sleep?.meetsTarget ? 'theme-accent-text' : 'text-rose-600'" :size="22" />
          <p class="text-[10px] font-medium text-slate-500">Sleep</p>
          <p class="mt-1 text-base font-bold text-slate-900">{{ sleepAverage }}</p>
          <p class="mt-3 text-[12px]" :class="patientStore.sleep?.meetsTarget ? 'theme-accent-text' : 'text-rose-600'">
            Target is 7 hours
          </p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import {
  CalendarDays,
  ChevronRight,
  ClipboardList,
  MoonStar,
  Pill,
  Settings2,
  User,
  Utensils,
} from "lucide-vue-next";

import TrendChart from "@/components/charts/TrendChart.vue";
import { usePatientStore } from "@/stores/patient";
import { useSessionStore } from "@/stores/session";

const patientStore = usePatientStore();
const sessionStore = useSessionStore();
const router = useRouter();

const labels = computed(() => patientStore.progress.map((point) => point.day));
const compliance = computed(() => patientStore.progress.map((point) => point.compliance));
const sleepAverage = computed(() =>
  patientStore.sleep ? `${patientStore.sleep.averageHours.toFixed(1)} hours average` : "No sleep data",
);
</script>
