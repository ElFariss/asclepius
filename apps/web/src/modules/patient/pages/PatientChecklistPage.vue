<template>
  <div class="flex h-full flex-col bg-white">
    <div class="flex items-center justify-between border-b border-slate-100 p-6">
      <div class="flex items-center gap-4">
        <button
          class="rounded-full p-2 transition-colors hover:bg-slate-100"
          type="button"
          @click="router.push('/patient/dashboard')"
        >
          <ArrowLeft :size="20" />
        </button>
        <h2 class="page-title text-xl font-bold">Daily Checklist</h2>
      </div>
      <div class="rounded-full bg-blue-50 px-3 py-1">
        <p class="text-xs font-bold text-blue-600">{{ patientStore.completedCount }}/{{ patientStore.tasks.length }}</p>
      </div>
    </div>

    <div class="space-y-4 overflow-y-auto p-6">
      <div class="mb-4 flex gap-3 rounded-2xl bg-slate-50 p-4">
        <AlertCircle
          class="shrink-0 text-blue-500"
          :size="20"
        />
        <p class="text-xs leading-relaxed text-slate-600">
          Please fill out this checklist honestly. Non-compliance can increase the risk of surgical complications.
        </p>
      </div>

      <button
        v-for="task in patientStore.tasks"
        :key="task.id"
        class="flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-all"
        :class="task.completed ? 'border-yellow-100 bg-yellow-50' : 'border-slate-200 bg-white shadow-sm'"
        type="button"
        @click="patientStore.toggleTask(task.id)"
      >
        <div
          class="flex h-8 w-8 items-center justify-center rounded-xl border-2 transition-all"
          :class="task.completed ? 'scale-110 border-yellow-400 bg-yellow-400' : 'border-slate-300'"
        >
          <CheckCircle
            v-if="task.completed"
            class="text-yellow-900"
            :size="20"
          />
        </div>
        <div class="flex-1">
          <p
            class="font-bold text-slate-900 transition-all"
            :class="task.completed ? 'text-yellow-900 opacity-60' : ''"
          >
            {{ task.title }}
          </p>
          <div class="mt-1 flex items-center gap-3">
            <p class="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <Clock :size="10" />
              {{ task.time }}
            </p>
            <div class="h-1 w-1 rounded-full bg-slate-300" />
            <p class="text-[10px] font-bold uppercase tracking-wider text-blue-500">
              {{ task.category }}
            </p>
          </div>
        </div>
      </button>

      <div class="pt-8 text-center">
        <p class="text-xs italic text-slate-400">
          The system will automatically record your task completion time.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { AlertCircle, ArrowLeft, CheckCircle, Clock } from "lucide-vue-next";

import { usePatientStore } from "@/stores/patient";

const patientStore = usePatientStore();
const router = useRouter();

onMounted(async () => {
  if (!patientStore.tasks.length) {
    await patientStore.loadDashboard();
  }
});
</script>
