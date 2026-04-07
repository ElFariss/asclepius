<template>
  <div class="flex h-full flex-col bg-white">
    <div class="flex items-center gap-4 border-b border-slate-100 p-6">
      <button
        class="rounded-full p-2 transition-colors hover:bg-slate-100"
        type="button"
        @click="router.push(`/doctor/patients/${route.params.id}`)"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <h2 class="page-title text-xl font-bold">Monthly Schedule</h2>
        <p class="text-[10px] font-bold uppercase text-slate-400">{{ doctorStore.currentPatient?.name }} • April 2026</p>
      </div>
    </div>

    <div class="flex-1 space-y-6 overflow-y-auto p-6">
      <div class="grid grid-cols-7 gap-2">
        <div
          v-for="day in weekDays"
          :key="day"
          class="py-2 text-center"
        >
          <p class="text-[10px] font-bold uppercase text-slate-400">{{ day }}</p>
        </div>
        <div class="col-span-2" />
        <div
          v-for="day in days"
          :key="day"
          class="relative flex aspect-square flex-col items-center justify-center rounded-xl border"
          :class="day === 13 ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100' : 'border-slate-100 bg-white text-slate-600'"
        >
          <span class="text-xs font-bold">{{ day }}</span>
          <div
            v-if="day < 13"
            class="mt-1 flex gap-0.5"
          >
            <div class="h-1 w-1 rounded-full bg-green-500" />
            <div class="h-1 w-1 rounded-full bg-green-500" />
          </div>
          <div
            v-if="day === 15"
            class="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500"
          />
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="text-sm font-bold">Legend</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-green-500" />
            <span class="text-xs text-slate-600">Tasks Completed</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-red-500" />
            <span class="text-xs text-slate-600">Surgery Date</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-blue-600" />
            <span class="text-xs text-slate-600">Today</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";

import { useDoctorStore } from "@/stores/doctor";

const doctorStore = useDoctorStore();
const route = useRoute();
const router = useRouter();
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const days = Array.from({ length: 30 }, (_, index) => index + 1);

onMounted(async () => {
  if (!doctorStore.currentPatient || doctorStore.currentPatient.id !== route.params.id) {
    await doctorStore.loadPatient(route.params.id.toString());
  }
});
</script>
