<template>
  <div
    v-if="patientStore.profile"
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
      <h2 class="page-title text-xl font-bold">Compliance Analysis</h2>
    </div>

    <div class="space-y-8 overflow-y-auto p-6">
      <div>
        <div class="mb-4 flex items-center justify-between">
          <h3 class="flex items-center gap-2 font-bold">
            <TrendingUp
              :size="18"
              class="text-blue-600"
            />
            Daily Compliance (%)
          </h3>
          <span class="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
            Avg: {{ patientStore.profile.compliance }}%
          </span>
        </div>
        <div class="h-48 w-full">
          <TrendChart
            :labels="labels"
            :values="compliance"
            color="#2563eb"
          />
        </div>
      </div>

      <div>
        <div class="mb-4 flex items-center justify-between">
          <h3 class="flex items-center gap-2 font-bold text-red-500">
            <Activity :size="18" />
            Risk Score Trend
          </h3>
          <span class="rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-500">
            Low Risk
          </span>
        </div>
        <div class="h-48 w-full">
          <TrendChart
            :fill="false"
            :labels="labels"
            :max="20"
            :values="risk"
            color="#ef4444"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p class="mb-1 text-xs font-medium text-slate-500">Total Days</p>
          <p class="text-xl font-bold text-slate-900">12/180</p>
        </div>
        <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p class="mb-1 text-xs font-medium text-slate-500">Status</p>
          <p class="text-xl font-bold text-green-600">Optimal</p>
        </div>
      </div>

      <div class="flex gap-3 rounded-2xl border border-yellow-100 bg-yellow-50 p-5">
        <Info class="shrink-0 text-yellow-600" />
        <p class="text-xs font-medium leading-relaxed text-yellow-800">
          The chart above shows the correlation between your checklist compliance and the reduction in surgical complication risk scores.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Activity, ArrowLeft, Info, TrendingUp } from "lucide-vue-next";

import TrendChart from "@/components/charts/TrendChart.vue";
import { usePatientStore } from "@/stores/patient";

const patientStore = usePatientStore();
const router = useRouter();

const labels = computed(() => patientStore.progress.map((point) => point.day));
const compliance = computed(() => patientStore.progress.map((point) => point.compliance));
const risk = computed(() => patientStore.progress.map((point) => point.risk));

onMounted(async () => {
  if (!patientStore.progress.length) {
    await patientStore.loadDashboard();
  }
});
</script>
