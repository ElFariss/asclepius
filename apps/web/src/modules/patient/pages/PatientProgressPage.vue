<template>
  <div
    v-if="patientStore.profile"
    class="space-y-8"
  >
    <div class="space-y-3">
      <p class="eyebrow">Progress analysis</p>
      <h2 class="page-title text-3xl font-bold">Compliance and risk trend</h2>
      <p class="muted-copy max-w-3xl text-sm leading-7">
        These trends are illustrative in phase one, but the layout is already shaped for future backend and AI-driven scoring.
      </p>
    </div>

    <div class="grid gap-5 lg:grid-cols-2">
      <section class="surface-elevated rounded-[2rem] p-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="eyebrow">Daily compliance</p>
            <p class="mt-2 text-xl font-semibold text-slate-900">Average {{ patientStore.profile.compliance }}%</p>
          </div>
          <span class="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-[var(--brand-blue)]">Stable</span>
        </div>
        <div class="mt-5 h-56">
          <TrendChart
            :labels="labels"
            :values="compliance"
            color="#1565d8"
          />
        </div>
      </section>

      <section class="surface-soft rounded-[2rem] p-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="eyebrow">Risk score</p>
            <p class="mt-2 text-xl font-semibold text-slate-900">Current {{ patientStore.profile.riskScore }}</p>
          </div>
          <span class="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-rose-600">Low risk</span>
        </div>
        <div class="mt-5 h-56">
          <TrendChart
            :fill="false"
            :labels="labels"
            :values="risk"
            color="#ef4444"
            :max="20"
          />
        </div>
      </section>
    </div>

    <div class="grid gap-5 md:grid-cols-3">
      <section class="surface-elevated rounded-[2rem] p-5">
        <p class="eyebrow">Total days</p>
        <p class="mt-3 text-2xl font-semibold text-slate-900">12 / 180</p>
      </section>
      <section class="surface-elevated rounded-[2rem] p-5">
        <p class="eyebrow">Status</p>
        <p class="mt-3 text-2xl font-semibold text-emerald-600">Optimal</p>
      </section>
      <section class="surface-warm rounded-[2rem] p-5">
        <p class="eyebrow">Insight</p>
        <p class="mt-3 text-sm leading-7 text-slate-800">
          Better checklist consistency is correlated with a lower modeled complication score.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";

import TrendChart from "@/components/charts/TrendChart.vue";
import { usePatientStore } from "@/stores/patient";

const patientStore = usePatientStore();

const labels = computed(() => patientStore.progress.map((point) => point.day));
const compliance = computed(() => patientStore.progress.map((point) => point.compliance));
const risk = computed(() => patientStore.progress.map((point) => point.risk));

onMounted(async () => {
  if (!patientStore.progress.length) {
    await patientStore.loadDashboard();
  }
});
</script>
