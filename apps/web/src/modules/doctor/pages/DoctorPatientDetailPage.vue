<template>
  <div
    v-if="doctorStore.currentPatient"
    class="space-y-8"
  >
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="eyebrow">Patient detail</p>
        <h2 class="page-title mt-2 text-3xl font-bold">{{ doctorStore.currentPatient.name }}</h2>
        <p class="mt-2 text-sm text-[var(--text-muted)]">{{ doctorStore.currentPatient.procedure }}</p>
      </div>
      <RouterLink
        class="rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-[var(--brand-blue)]"
        :to="`/doctor/patients/${route.params.id}/calendar`"
      >
        Open full calendar
      </RouterLink>
    </div>

    <div class="grid gap-5 lg:grid-cols-2">
      <section class="surface-soft rounded-[2rem] p-6">
        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <p class="eyebrow">Compliance</p>
            <p class="mt-2 text-3xl font-semibold text-[var(--brand-blue)]">{{ doctorStore.currentPatient.compliance }}%</p>
          </div>
          <div>
            <p class="eyebrow">Risk score</p>
            <p class="mt-2 text-3xl font-semibold text-slate-900">{{ doctorStore.currentPatient.riskScore }}</p>
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

      <section class="surface-elevated rounded-[2rem] p-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="eyebrow">Task tracker</p>
            <p class="mt-2 text-lg font-semibold text-slate-900">Next appointment {{ doctorStore.currentPatient.nextAppointment }}</p>
          </div>
          <span class="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--brand-blue)]">
            {{ doctorStore.currentPatient.status }}
          </span>
        </div>
        <div class="mt-6 space-y-3">
          <div
            v-for="task in doctorStore.currentPatient.tasks"
            :key="task.id"
            class="rounded-[1.5rem] bg-white/70 px-4 py-4"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-slate-900">{{ task.title }}</p>
                <p class="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">{{ task.time }}</p>
              </div>
              <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="task.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'">
                {{ task.completed ? "Done" : "Pending" }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <section
      v-if="doctorStore.currentPatient.risk === 'High'"
      class="rounded-[2rem] bg-rose-50 p-6"
    >
      <p class="eyebrow text-rose-700">High risk warning</p>
      <p class="mt-4 text-sm leading-8 text-rose-900">
        Compliance is below the safe threshold. Contact the patient, review the protocol, and confirm the preparation status before final clearance.
      </p>
    </section>

    <div class="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
      <section class="surface-elevated rounded-[2rem] p-6">
        <p class="eyebrow">Clinical notes</p>
        <p class="mt-4 text-sm leading-8 text-slate-800">{{ doctorStore.currentPatient.notes }}</p>
      </section>

      <section class="surface-warm rounded-[2rem] p-6">
        <p class="eyebrow">Go / no-go</p>
        <div class="mt-5 grid gap-3">
          <button
            class="rounded-[1.5rem] px-4 py-4 text-left text-sm font-semibold transition"
            :class="doctorStore.surgeryDecision === 'go' ? 'bg-emerald-600 text-white' : 'bg-white/80 text-slate-900'"
            type="button"
            @click="doctorStore.setSurgeryDecision('go')"
          >
            Proceed with surgery
          </button>
          <button
            class="rounded-[1.5rem] px-4 py-4 text-left text-sm font-semibold transition"
            :class="doctorStore.surgeryDecision === 'no-go' ? 'bg-rose-600 text-white' : 'bg-white/80 text-slate-900'"
            type="button"
            @click="doctorStore.setSurgeryDecision('no-go')"
          >
            Postpone or cancel
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";

import TrendChart from "@/components/charts/TrendChart.vue";
import { progressSeries } from "@/services/fixtures/data";
import { useDoctorStore } from "@/stores/doctor";

const doctorStore = useDoctorStore();
const route = useRoute();

const labels = computed(() => progressSeries.map((point) => point.day));
const compliance = computed(() => progressSeries.map((point) => point.compliance));

onMounted(async () => {
  await doctorStore.loadPatient(route.params.id.toString());
});
</script>
