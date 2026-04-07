<template>
  <div
    v-if="doctorStore.dashboard"
    class="space-y-8"
  >
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="eyebrow">Doctor dashboard</p>
        <h2 class="page-title mt-2 text-3xl font-bold">Monitor readiness across the active patient list.</h2>
      </div>
      <RouterLink
        class="rounded-full bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)]"
        to="/doctor/patients/new"
      >
        Add new patient
      </RouterLink>
    </div>

    <div class="grid gap-5 md:grid-cols-2">
      <section class="surface-soft rounded-[2rem] p-6">
        <p class="eyebrow">Active patients</p>
        <p class="mt-3 text-4xl font-semibold text-slate-900">{{ doctorStore.dashboard.activePatients }}</p>
      </section>
      <section class="surface-warm rounded-[2rem] p-6">
        <p class="eyebrow">Needs intervention</p>
        <p class="mt-3 text-4xl font-semibold text-slate-900">{{ doctorStore.dashboard.needsIntervention }}</p>
      </section>
    </div>

    <section class="surface-elevated rounded-[2rem] p-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="eyebrow">Search patient</p>
          <p class="mt-2 text-sm text-[var(--text-muted)]">Filter by patient name or procedure.</p>
        </div>
        <input
          v-model="query"
          class="w-full rounded-full bg-white/75 px-4 py-3 text-sm outline-none md:max-w-sm"
          placeholder="Search name or procedure..."
          type="search"
        />
      </div>
    </section>

    <div class="space-y-4">
      <button
        v-for="patient in filteredPatients"
        :key="patient.id"
        class="surface-elevated w-full rounded-[2rem] px-5 py-5 text-left transition hover:-translate-y-0.5"
        type="button"
        @click="router.push(`/doctor/patients/${patient.id}`)"
      >
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div
              class="flex h-14 w-14 items-center justify-center rounded-[1.3rem] text-lg font-bold text-white"
              :class="patient.risk === 'High' ? 'bg-rose-500' : patient.risk === 'Medium' ? 'bg-amber-500' : 'bg-[var(--brand-blue)]'"
            >
              {{ patient.riskScore }}
            </div>
            <div>
              <p class="text-lg font-semibold text-slate-900">{{ patient.name }}</p>
              <p class="mt-1 text-sm text-[var(--text-muted)]">{{ patient.procedure }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-lg font-semibold text-slate-900">{{ patient.compliance }}%</p>
            <p class="mt-1 text-sm font-medium" :class="patient.risk === 'High' ? 'text-rose-600' : patient.risk === 'Medium' ? 'text-amber-700' : 'text-[var(--brand-blue)]'">
              {{ patient.status }}
            </p>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

import { useDoctorStore } from "@/stores/doctor";

const doctorStore = useDoctorStore();
const router = useRouter();
const query = ref("");

const filteredPatients = computed(() =>
  doctorStore.dashboard?.patients.filter((patient) => {
    const haystack = `${patient.name} ${patient.procedure}`.toLowerCase();
    return haystack.includes(query.value.toLowerCase());
  }) ?? [],
);

onMounted(async () => {
  if (!doctorStore.dashboard) {
    await doctorStore.loadDashboard();
  }
});
</script>
