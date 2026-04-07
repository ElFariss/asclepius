<template>
  <div class="space-y-8">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="eyebrow">Monthly tracker</p>
        <h2 class="page-title mt-2 text-3xl font-bold">April 2026 readiness calendar</h2>
      </div>
      <RouterLink
        class="rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-[var(--brand-blue)]"
        :to="`/doctor/patients/${route.params.id}`"
      >
        Back to patient detail
      </RouterLink>
    </div>

    <section class="surface-elevated rounded-[2rem] p-6">
      <div class="grid grid-cols-7 gap-3 text-center">
        <p
          v-for="day in weekDays"
          :key="day"
          class="eyebrow"
        >
          {{ day }}
        </p>
        <div class="col-span-2 hidden md:block" />
        <div
          v-for="day in days"
          :key="day"
          class="flex aspect-square items-center justify-center rounded-[1.25rem] text-sm font-semibold"
          :class="day === 13 ? 'bg-[var(--brand-blue)] text-white shadow-[var(--shadow-soft)]' : day === 15 ? 'surface-warm text-slate-900' : 'bg-white/75 text-slate-700'"
        >
          {{ day }}
        </div>
      </div>
    </section>

    <section class="surface-soft rounded-[2rem] p-6">
      <div class="grid gap-4 md:grid-cols-3">
        <div class="flex items-center gap-3">
          <div class="h-3 w-3 rounded-full bg-emerald-500" />
          <span class="text-sm text-slate-700">Completed tasks</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="h-3 w-3 rounded-full bg-[var(--brand-blue)]" />
          <span class="text-sm text-slate-700">Today</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="h-3 w-3 rounded-full bg-[var(--brand-yellow)]" />
          <span class="text-sm text-slate-700">Surgery date</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const days = Array.from({ length: 30 }, (_, index) => index + 1);
</script>
