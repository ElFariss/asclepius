<template>
  <div
    v-if="patientStore.sleep"
    class="flex h-full flex-col bg-white"
  >
    <div class="flex items-center gap-4 border-b border-slate-100 p-6">
      <button
        class="rounded-full p-2 transition-colors hover:bg-slate-100"
        type="button"
        @click="router.push('/patient/dashboard')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <h2 class="page-title text-xl font-bold">Sleep</h2>
        <p class="text-sm text-slate-500">Target is {{ patientStore.sleep.targetHours }} hours per night</p>
      </div>
    </div>

    <div class="space-y-8 overflow-y-auto p-6">
      <div class="rounded-[2rem] border border-slate-100 bg-slate-50 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="eyebrow">Average sleep</p>
            <p class="mt-2 text-2xl font-semibold text-slate-900">{{ patientStore.sleep.averageHours.toFixed(1) }} hours</p>
          </div>
          <div
            class="rounded-full px-4 py-2 text-sm font-semibold"
            :class="patientStore.sleep.meetsTarget ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
          >
            {{ patientStore.sleep.meetsTarget ? "Enough sleep" : "Below target" }}
          </div>
        </div>

        <div class="mt-5 h-56">
          <TrendChart
            :fill="false"
            :labels="labels"
            :max="10"
            :values="hours"
            :color="patientStore.sleep.meetsTarget ? '#16a34a' : '#ef4444'"
          />
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="entry in patientStore.sleep.entries"
          :key="entry.date"
          class="flex items-center justify-between rounded-[1.5rem] border border-slate-100 bg-white px-5 py-4 shadow-sm"
        >
          <div>
            <p class="font-semibold text-slate-900">{{ entry.date }}</p>
            <p class="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">Estimated from phase-one mock data</p>
          </div>
          <p class="text-lg font-bold" :class="formatSleepStatus(entry, patientStore.sleep.targetHours)">
            {{ entry.hours.toFixed(1) }}h
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";

import TrendChart from "@/components/charts/TrendChart.vue";
import { formatSleepStatus } from "@/modules/shared/utils/carePlan";
import { usePatientStore } from "@/stores/patient";

const patientStore = usePatientStore();
const router = useRouter();

const labels = computed(() => patientStore.sleep?.entries.map((entry) => entry.date.slice(-2)) ?? []);
const hours = computed(() => patientStore.sleep?.entries.map((entry) => entry.hours) ?? []);

onMounted(async () => {
  if (!patientStore.sleep) {
    await patientStore.loadDashboard();
  }
});
</script>
