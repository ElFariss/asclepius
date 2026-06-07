<template>
  <div
    v-if="doctorStore.dashboard"
    class="min-h-screen bg-[color:var(--surface-page)] px-4 py-6 pb-32 md:px-8"
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
                class="theme-accent-bg flex h-full w-full items-center justify-center text-lg font-bold text-white"
              >
                {{ doctorInitials }}
              </div>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Dashboard</p>
              <p class="page-title text-xl font-bold text-slate-900">{{ doctorStore.dashboard.doctorName }}</p>
            </div>
          </div>

          <button
            class="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700"
            type="button"
            @click="router.push('/doctor/settings')"
          >
            <Settings2 :size="18" />
          </button>
        </div>

        <div class="rounded-[1.45rem] bg-[color:var(--surface-subtle)] p-4">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <p class="eyebrow">Metrics</p>
              <h2 class="page-title text-lg font-bold text-slate-900">All patient metrics</h2>
            </div>
          </div>
          <div class="h-64 w-full">
            <MultiMetricChart :series="doctorStore.dashboard.metricSeries" />
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <div class="rounded-[1.35rem] px-4 py-4 text-white shadow-xl shadow-slate-200/50" style="background: linear-gradient(135deg, var(--theme-primary), var(--theme-primary-deep));">
            <Users :size="18" class="mb-2 opacity-70" />
            <p class="page-title text-[1.7rem] font-bold">{{ doctorStore.dashboard.activePatients }}</p>
            <p class="text-[10px] font-bold uppercase tracking-[0.16em] opacity-80 sm:hidden">Active</p>
            <p class="hidden text-[10px] font-bold uppercase tracking-[0.16em] opacity-80 sm:block">Active Patients</p>
          </div>
          <div class="rounded-[1.35rem] border border-rose-200 bg-rose-50 px-4 py-4 shadow-xl shadow-rose-100/40">
            <CircleAlert :size="18" class="mb-2 text-rose-600" />
            <p class="page-title text-[1.7rem] font-bold text-slate-900">{{ doctorStore.dashboard.needsIntervention }}</p>
            <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-rose-700 sm:hidden">Intervene</p>
            <p class="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-rose-700 sm:block">Needs Intervention</p>
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
                class="flex h-10 w-10 items-center justify-center rounded-full border bg-white"
                :class="statusBadgeClass(patient)"
                :title="patient.status"
              >
                <component :is="statusIcon(patient)" :size="16" />
              </span>
            </div>

            <div class="mt-4 grid grid-cols-[1fr_112px] items-center gap-3 sm:grid-cols-[1fr_128px]">
              <div>
                <p class="text-[11px] font-medium text-slate-500">Preview metrics</p>
                <p
                  class="mt-1 text-xl font-bold"
                  :class="metricTextClass(patient)"
                >
                  {{ patient.compliance }}%
                </p>
              </div>
              <SparklineChart
                :color="sparklineColor(patient)"
                :values="patient.metrics"
              />
            </div>
          </button>
        </div>
      </section>
    </div>

    <div class="fixed inset-x-0 bottom-6 z-30 mx-auto flex w-fit items-end justify-center gap-4">
      <Transition name="route-fade">
        <button
          v-if="actionsOpen"
          class="rounded-full border border-slate-200 bg-white px-4 py-3 text-[12px] font-semibold text-slate-700 shadow-xl shadow-slate-200/60"
          type="button"
          @click="openAddPatient"
        >
          Add patient
        </button>
      </Transition>
      <button
        class="theme-accent-bg flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl"
        type="button"
        @click="actionsOpen = !actionsOpen"
      >
        <Plus :size="24" />
      </button>
      <Transition name="route-fade">
        <button
          v-if="actionsOpen"
          class="rounded-full border border-slate-200 bg-white px-4 py-3 text-[12px] font-semibold text-slate-700 shadow-xl shadow-slate-200/60"
          type="button"
          @click="openRiskScore"
        >
          Add risk scoring
        </button>
      </Transition>
    </div>

    <ModalShell
      :open="riskOpen"
      description="Create a manual risk-scoring entry for one of your patients."
      title="Add Risk Scoring"
      @close="riskOpen = false"
    >
      <div class="space-y-4 p-6">
        <label class="block space-y-2">
          <span class="eyebrow">Patient</span>
          <select
            v-model="riskForm.patientId"
            class="theme-input"
          >
            <option
              v-for="patient in doctorStore.dashboard.patients"
              :key="patient.id"
              :value="patient.id"
            >
              {{ patient.name }}
            </option>
          </select>
        </label>
        <label class="block space-y-2">
          <span class="eyebrow">Variable</span>
          <input
            v-model="riskForm.variableName"
            class="theme-input"
            placeholder="Exercise"
            type="text"
          />
        </label>
        <label class="block space-y-2">
          <span class="eyebrow">Numeric score</span>
          <input
            v-model.number="riskForm.score"
            class="theme-input"
            min="0"
            type="number"
          />
        </label>
        <label class="block space-y-2">
          <span class="eyebrow">Note</span>
          <textarea
            v-model="riskForm.note"
            class="min-h-24 w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-900 outline-none"
            placeholder="Why this score was assigned"
          />
        </label>
        <div class="flex justify-end gap-3">
          <button
            class="rounded-[1rem] bg-slate-100 px-4 py-3 text-[13px] font-semibold text-slate-700"
            type="button"
            @click="riskOpen = false"
          >
            Cancel
          </button>
          <button
            class="theme-accent-bg rounded-[1rem] px-4 py-3 text-[13px] font-semibold text-white"
            type="button"
            @click="submitRiskScore"
          >
            Save
          </button>
        </div>
      </div>
    </ModalShell>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import {
  CircleAlert,
  Clock3,
  Plus,
  Settings2,
  ShieldCheck,
  TriangleAlert,
  Users,
} from "lucide-vue-next";

import MultiMetricChart from "@/components/charts/MultiMetricChart.vue";
import SparklineChart from "@/components/charts/SparklineChart.vue";
import ModalShell from "@/components/ui/ModalShell.vue";
import { useDoctorStore } from "@/stores/doctor";
import { useSessionStore } from "@/stores/session";
import type { DoctorPatientSummary } from "@/types/domain";

const doctorStore = useDoctorStore();
const sessionStore = useSessionStore();
const router = useRouter();

const actionsOpen = ref(false);
const riskOpen = ref(false);
const riskForm = reactive({
  patientId: "",
  variableName: "",
  score: 0,
  note: "",
});

const doctorInitials = computed(() =>
  (sessionStore.displayName || doctorStore.dashboard?.doctorName || "Doctor")
    .replace(/^dr\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join(""),
);

const statusIcon = (patient: DoctorPatientSummary) => {
  if (patient.inviteStatus === "pending-acceptance") {
    return Clock3;
  }
  if (patient.risk === "Intervene") {
    return CircleAlert;
  }
  if (patient.risk === "Borderline") {
    return TriangleAlert;
  }
  return ShieldCheck;
};

const statusBadgeClass = (patient: DoctorPatientSummary) => {
  if (patient.inviteStatus === "pending-acceptance") {
    return "border-yellow-200 text-yellow-700";
  }
  if (patient.risk === "Intervene") {
    return "border-rose-300 text-rose-600";
  }
  if (patient.risk === "Borderline") {
    return "border-yellow-200 text-yellow-700";
  }
  return "border-emerald-200 text-emerald-600";
};

const sparklineColor = (patient: DoctorPatientSummary) => {
  if (patient.risk === "Intervene") {
    return "#e11d48";
  }
  if (patient.risk === "Borderline" || patient.inviteStatus === "pending-acceptance") {
    return "#d97706";
  }
  return "#16a34a";
};

const metricTextClass = (patient: DoctorPatientSummary) => {
  if (patient.risk === "Intervene") {
    return "text-rose-600";
  }
  if (patient.risk === "Borderline" || patient.inviteStatus === "pending-acceptance") {
    return "text-yellow-700";
  }
  return "text-emerald-600";
};

const openAddPatient = () => {
  actionsOpen.value = false;
  void router.push("/doctor/patients/new");
};

const openRiskScore = () => {
  actionsOpen.value = false;
  riskForm.patientId = doctorStore.dashboard?.patients[0]?.id ?? "";
  riskForm.variableName = "";
  riskForm.score = 0;
  riskForm.note = "";
  riskOpen.value = true;
};

const submitRiskScore = async () => {
  if (!riskForm.patientId || !riskForm.variableName.trim()) {
    return;
  }
  await doctorStore.createRiskScore(riskForm.patientId, {
    variableName: riskForm.variableName.trim(),
    score: Number(riskForm.score) || 0,
    note: riskForm.note.trim(),
  });
  riskOpen.value = false;
};
</script>
