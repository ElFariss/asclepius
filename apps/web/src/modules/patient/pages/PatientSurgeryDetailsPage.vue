<template>
  <div class="flex h-full flex-col bg-white p-6">
    <div class="mb-8 flex items-center gap-2">
      <div class="h-6 w-1.5 rounded-full bg-blue-600" />
      <h2 class="page-title text-xl font-bold">Surgery Details</h2>
    </div>

    <div class="mb-8 flex gap-4">
      <div class="h-32 w-24 shrink-0 overflow-hidden rounded-2xl shadow-md">
        <img
          alt="Doctor"
          class="h-full w-full object-cover"
          referrerpolicy="no-referrer"
          src="https://picsum.photos/seed/doctor/400/600"
        />
      </div>
      <div class="flex flex-col justify-center">
        <p class="mb-1 text-xs font-bold uppercase tracking-wider text-blue-600">Attending Physician</p>
        <p class="text-lg font-bold text-slate-900">{{ patientStore.profile?.attendingDoctor }}</p>
        <p class="text-sm text-slate-500">{{ patientStore.profile?.specialty }}</p>
        <div class="mt-2 flex gap-1">
          <div
            v-for="index in 5"
            :key="index"
            class="h-1 w-1 rounded-full bg-blue-200"
          />
        </div>
      </div>
    </div>

    <div class="flex-1 space-y-6">
      <div class="rounded-2xl border border-slate-100 bg-slate-50 p-5">
        <h3 class="mb-3 flex items-center gap-2 font-bold text-slate-900">
          <Activity
            :size="18"
            class="text-blue-600"
          />
          Medical Procedure
        </h3>
        <p class="text-sm leading-relaxed text-slate-600">
          Laparoscopic Cholecystectomy is a minimally invasive surgical procedure to remove the gallbladder. The doctor will make 3-4 small incisions in the abdomen to insert a camera and surgical instruments.
        </p>
      </div>

      <div class="rounded-2xl border border-slate-100 bg-slate-50 p-5">
        <h3 class="mb-3 flex items-center gap-2 font-bold text-slate-900">
          <Clock
            :size="18"
            class="text-blue-600"
          />
          Estimated Time
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-slate-400">Surgery Duration</p>
            <p class="text-sm font-bold">{{ patientStore.profile?.surgeryDuration }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">Hospital Stay</p>
            <p class="text-sm font-bold">{{ patientStore.profile?.hospitalStay }}</p>
          </div>
        </div>
      </div>
    </div>

    <button
      class="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 font-semibold text-white transition-transform active:scale-95"
      type="button"
      @click="continueToConsent"
    >
      Continue to Requirements
      <ChevronRight :size="20" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { Activity, ChevronRight, Clock } from "lucide-vue-next";

import { usePatientStore } from "@/stores/patient";
import { useSessionStore } from "@/stores/session";

const patientStore = usePatientStore();
const router = useRouter();
const sessionStore = useSessionStore();

const continueToConsent = async () => {
  await sessionStore.advancePatientStage("consent");
  await router.push("/patient/consent");
};

onMounted(async () => {
  if (!patientStore.profile) {
    await patientStore.loadDashboard();
  }
});
</script>
