<template>
  <div
    v-if="doctorStore.dashboard"
    class="min-h-screen bg-[color:var(--surface-page)] px-4 py-6 pb-28 md:px-8"
  >
    <div class="w-full space-y-6">
      <section class="rounded-[1.7rem] bg-white p-5 shadow-2xl shadow-slate-200/60 md:p-7">
        <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="h-14 w-14 overflow-hidden rounded-2xl bg-slate-100">
              <img
                v-if="sessionStore.avatarUrl"
                :src="sessionStore.avatarUrl"
                alt="Doctor profile"
                class="h-full w-full object-cover"
              />
              <div
                v-else
                class="theme-accent-bg flex h-full w-full items-center justify-center text-lg font-bold"
              >
                {{ doctorInitials }}
              </div>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Dashboard</p>
              <p class="page-title text-xl font-bold text-slate-900">{{ doctorStore.dashboard.doctorName }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
              class="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700"
              type="button"
              @click="router.push('/doctor/settings')"
            >
              <Settings2 :size="18" />
            </button>
          </div>
        </div>

        <div class="rounded-[1.45rem] bg-[color:var(--surface-subtle)] p-4">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <p class="eyebrow">Compliance</p>
              <h2 class="page-title text-lg font-bold text-slate-900">All patient trends</h2>
            </div>
          </div>
          <div class="h-64 w-full">
            <MultiTrendChart :series="doctorStore.dashboard.complianceSeries" />
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <div class="rounded-[1.35rem] px-4 py-4 text-white shadow-xl shadow-slate-200/50" style="background: linear-gradient(135deg, var(--theme-primary), var(--theme-primary-deep));">
            <Users
              :size="18"
              class="mb-2 opacity-70"
            />
            <p class="page-title text-[1.7rem] font-bold">{{ doctorStore.dashboard.activePatients }}</p>
            <p class="text-[10px] font-bold uppercase tracking-[0.16em] opacity-80 sm:hidden">Active</p>
            <p class="hidden text-[10px] font-bold uppercase tracking-[0.16em] opacity-80 sm:block">Active Patients</p>
          </div>
          <div class="rounded-[1.35rem] border border-yellow-100 bg-yellow-50 px-4 py-4 shadow-xl shadow-yellow-100/40">
            <AlertCircle
              :size="18"
              class="mb-2 text-yellow-600"
            />
            <p class="page-title text-[1.7rem] font-bold text-slate-900">{{ doctorStore.dashboard.needsIntervention }}</p>
            <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-yellow-700 sm:hidden">Needs Help</p>
            <p class="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-yellow-700 sm:block">Needs Intervention</p>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="eyebrow">Patients</p>
            <h3 class="page-title text-xl font-bold text-slate-900">Current operation list</h3>
          </div>
        </div>

        <div class="grid gap-4 lg:grid-cols-2">
          <button
            v-for="patient in doctorStore.dashboard.patients"
            :key="patient.id"
            class="rounded-[1.5rem] bg-white p-4 text-left shadow-xl shadow-slate-200/50 transition hover:-translate-y-0.5"
            type="button"
            @click="router.push(`/doctor/patients/${patient.id}`)"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="h-14 w-14 overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    v-if="patient.avatarUrl"
                    :src="patient.avatarUrl"
                    alt="Patient profile"
                    class="h-full w-full object-cover"
                  />
                  <div
                    v-else
                    class="theme-accent-soft flex h-full w-full items-center justify-center text-lg font-bold"
                  >
                    {{ patient.name.charAt(0) }}
                  </div>
                </div>
                <div>
                  <p class="text-base font-semibold text-slate-900">{{ patient.name }}</p>
                  <p class="mt-1 text-[12px] text-slate-500">{{ patient.procedure }}</p>
                </div>
              </div>

              <span
                class="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
                :class="patient.inviteStatus === 'pending-acceptance'
                  ? 'pending-pill'
                  : patient.risk === 'High'
                    ? 'bg-rose-50 text-rose-600'
                    : patient.risk === 'Medium'
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'theme-accent-soft'"
              >
                {{ patient.status }}
              </span>
            </div>

            <div class="mt-4 grid grid-cols-[1fr_112px] items-center gap-3 sm:grid-cols-[1fr_128px]">
              <div>
                <p class="text-[11px] font-medium text-slate-500">Compliance</p>
                <p class="mt-1 text-xl font-bold text-slate-900">{{ patient.compliance }}%</p>
              </div>
              <SparklineChart :values="patient.trend" />
            </div>
          </button>
        </div>
      </section>
    </div>

    <button
      class="theme-accent-bg fixed inset-x-0 bottom-6 z-30 mx-auto flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl"
      type="button"
      @click="router.push('/doctor/patients/new')"
    >
      <Plus :size="24" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { AlertCircle, Plus, Settings2, Users } from "lucide-vue-next";

import MultiTrendChart from "@/components/charts/MultiTrendChart.vue";
import SparklineChart from "@/components/charts/SparklineChart.vue";
import { useDoctorStore } from "@/stores/doctor";
import { useSessionStore } from "@/stores/session";

const doctorStore = useDoctorStore();
const sessionStore = useSessionStore();
const router = useRouter();

const doctorInitials = computed(() =>
  (sessionStore.displayName || doctorStore.dashboard?.doctorName || "Doctor")
    .replace(/^dr\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join(""),
);
</script>
