<template>
  <div class="min-h-screen bg-[color:var(--surface-page)] px-4 py-6 md:px-8">
    <div class="w-full space-y-6">
      <div class="flex items-center gap-4">
        <button
          class="rounded-full border border-slate-200 bg-white p-3 text-slate-500 transition hover:text-slate-900"
          type="button"
          @click="router.push('/patient/dashboard')"
        >
          <ArrowLeft :size="18" />
        </button>
        <div>
          <p class="eyebrow">Medicine</p>
          <h1 class="page-title text-2xl font-bold text-slate-900">Medication plan</h1>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <button
          v-for="medication in patientStore.medications"
          :key="medication.id"
          class="rounded-[1.8rem] bg-white p-5 text-left shadow-xl shadow-slate-200/50 transition hover:-translate-y-0.5"
          type="button"
          @click="selectedMedication = medication"
        >
          <div class="mb-4 flex items-center justify-between">
            <div class="theme-accent-soft flex h-12 w-12 items-center justify-center rounded-2xl">
              <Pill :size="22" />
            </div>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              {{ medication.schedule.frequency }}
            </span>
          </div>
          <p class="text-lg font-semibold text-slate-900">{{ medication.name }}</p>
          <p class="mt-3 text-sm leading-7 text-slate-600">{{ medication.description }}</p>
        </button>
      </div>
    </div>

    <ModalShell
      :description="selectedMedication ? formatCountdown(selectedMedication.schedule.nextDoseAt) : ''"
      :open="Boolean(selectedMedication)"
      title="Medicine details"
      @close="selectedMedication = null"
    >
      <div
        v-if="selectedMedication"
        class="space-y-4 p-6"
      >
        <div>
          <p class="page-title text-xl font-bold text-slate-900">{{ selectedMedication.name }}</p>
          <p class="mt-2 text-sm leading-7 text-slate-600">{{ selectedMedication.description }}</p>
        </div>
        <div class="grid gap-4 rounded-[1.5rem] bg-slate-50 p-4 md:grid-cols-2">
          <div>
            <p class="eyebrow">Dose</p>
            <p class="mt-2 text-sm font-semibold text-slate-900">{{ selectedMedication.schedule.amount }}</p>
          </div>
          <div>
            <p class="eyebrow">Frequency</p>
            <p class="mt-2 text-sm font-semibold text-slate-900">{{ selectedMedication.schedule.frequency }}</p>
          </div>
          <div>
            <p class="eyebrow">Meal timing</p>
            <p class="mt-2 text-sm font-semibold text-slate-900">
              {{ selectedMedication.schedule.mealTiming === "before-eating" ? "Before eating" : "After eating" }}
            </p>
          </div>
          <div>
            <p class="eyebrow">Next dose</p>
            <p class="mt-2 text-sm font-semibold theme-accent-text">{{ formatCountdown(selectedMedication.schedule.nextDoseAt) }}</p>
          </div>
        </div>
      </div>
    </ModalShell>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft, Pill } from "lucide-vue-next";

import ModalShell from "@/components/ui/ModalShell.vue";
import { formatCountdown } from "@/modules/shared/utils/carePlan";
import { usePatientStore } from "@/stores/patient";
import type { MedicationPlan } from "@/types/domain";

const patientStore = usePatientStore();
const router = useRouter();
const selectedMedication = ref<MedicationPlan | null>(null);
</script>
