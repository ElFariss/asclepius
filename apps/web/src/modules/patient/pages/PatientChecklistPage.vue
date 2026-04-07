<template>
  <div class="space-y-8">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="eyebrow">Daily checklist</p>
        <h2 class="page-title mt-2 text-3xl font-bold">Track preparation honestly.</h2>
      </div>
      <div class="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--brand-blue)]">
        {{ patientStore.completedCount }}/{{ patientStore.tasks.length }} done
      </div>
    </div>

    <section class="surface-soft rounded-[2rem] p-5">
      <p class="text-sm leading-7 text-slate-700">
        Non-compliance does not punish you. It helps the team understand when intervention is needed before anesthesia and surgery.
      </p>
    </section>

    <div class="space-y-4">
      <button
        v-for="task in patientStore.tasks"
        :key="task.id"
        class="w-full rounded-[2rem] px-5 py-5 text-left transition"
        :class="task.completed ? 'surface-warm' : 'surface-elevated'"
        type="button"
        @click="patientStore.toggleTask(task.id)"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-lg font-semibold text-slate-900">{{ task.title }}</p>
            <p class="mt-1 text-sm text-[var(--text-muted)]">{{ task.time }} · {{ task.category }}</p>
          </div>
          <span class="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
            {{ task.completed ? "Done" : "Pending" }}
          </span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import { usePatientStore } from "@/stores/patient";

const patientStore = usePatientStore();

onMounted(async () => {
  if (!patientStore.tasks.length) {
    await patientStore.loadDashboard();
  }
});
</script>
