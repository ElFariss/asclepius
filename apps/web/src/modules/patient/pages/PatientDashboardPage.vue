<template>
  <div
    v-if="patientStore.profile"
    class="space-y-8"
  >
    <div class="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <section class="surface-soft rounded-[2rem] p-6">
        <p class="eyebrow">Readiness overview</p>
        <div class="mt-4 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p class="page-title text-5xl font-bold text-[var(--brand-blue)]">{{ patientStore.profile.daysUntilSurgery }} days</p>
            <p class="mt-2 text-sm text-[var(--text-muted)]">until {{ patientStore.profile.surgeryDate }}</p>
          </div>
          <div class="space-y-2 text-right">
            <p class="text-sm text-[var(--text-muted)]">Compliance</p>
            <p class="text-3xl font-semibold text-slate-900">{{ patientStore.profile.compliance }}%</p>
          </div>
        </div>
        <div class="mt-6 h-56">
          <TrendChart
            :labels="labels"
            :values="compliance"
            color="#1565d8"
          />
        </div>
      </section>

      <section class="space-y-5">
        <div class="surface-elevated rounded-[2rem] p-6">
          <p class="eyebrow">Status</p>
          <p class="mt-3 text-2xl font-semibold text-slate-900">{{ patientStore.profile.status }}</p>
          <p class="mt-2 text-sm leading-7 text-[var(--text-muted)]">
            Your current trend suggests low procedural risk if daily preparation continues at the current pace.
          </p>
        </div>
        <div class="surface-warm rounded-[2rem] p-6">
          <p class="eyebrow">Streak</p>
          <p class="mt-3 text-2xl font-semibold text-slate-900">{{ patientStore.profile.streak }} days</p>
          <p class="mt-2 text-sm leading-7 text-slate-700">
            Keep momentum through nutrition, breathing, movement, and fasting milestones.
          </p>
        </div>
      </section>
    </div>

    <div class="grid gap-5 md:grid-cols-2">
      <button
        class="surface-elevated rounded-[2rem] p-6 text-left transition hover:-translate-y-0.5"
        type="button"
        @click="router.push('/patient/checklist')"
      >
        <p class="eyebrow">Checklist</p>
        <p class="mt-3 text-2xl font-semibold text-slate-900">{{ patientStore.completedCount }}/{{ patientStore.tasks.length }} complete</p>
        <p class="mt-2 text-sm leading-7 text-[var(--text-muted)]">
          Update your daily tasks honestly so the care team can spot risk early.
        </p>
      </button>

      <button
        class="surface-soft rounded-[2rem] p-6 text-left transition hover:-translate-y-0.5"
        type="button"
        @click="router.push('/patient/progress')"
      >
        <p class="eyebrow">Progress</p>
        <p class="mt-3 text-2xl font-semibold text-slate-900">Risk trending {{ patientStore.profile.risk }}</p>
        <p class="mt-2 text-sm leading-7 text-[var(--text-muted)]">
          Review the relationship between daily compliance and readiness trends.
        </p>
      </button>
    </div>

    <section class="surface-elevated rounded-[2rem] p-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="eyebrow">Latest consultation</p>
          <p class="mt-2 text-xl font-semibold text-slate-900">{{ patientStore.profile.lastConsultation }}</p>
        </div>
        <div class="rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-[var(--brand-blue)]">
          Next: {{ patientStore.profile.nextAppointment }}
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import TrendChart from "@/components/charts/TrendChart.vue";
import { usePatientStore } from "@/stores/patient";

const patientStore = usePatientStore();
const router = useRouter();

const labels = computed(() => patientStore.progress.map((point) => point.day));
const compliance = computed(() => patientStore.progress.map((point) => point.compliance));

onMounted(async () => {
  if (!patientStore.profile) {
    await patientStore.loadDashboard();
  }
});
</script>
