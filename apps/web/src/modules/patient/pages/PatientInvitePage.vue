<template>
  <div class="flex h-full flex-col bg-white p-6">
    <button
      class="mb-6 -ml-2 w-fit rounded-full p-2 transition-colors hover:bg-slate-100"
      type="button"
      @click="goBack"
    >
      <ArrowLeft :size="20" />
    </button>
    <div class="mt-4 mb-8 flex justify-center">
      <div class="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-blue-600">
        <Bell :size="40" />
      </div>
    </div>
    <h1 class="page-title mb-2 text-center text-2xl font-bold">Surgery Invitation</h1>
    <p class="mb-8 text-center text-slate-500">
      {{ patientStore.invite?.doctorName }} has registered you for an upcoming surgical procedure.
    </p>

    <div class="mb-8 rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div class="mb-4 flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
          <img
            alt="Doctor"
            class="h-full w-full object-cover"
            referrerpolicy="no-referrer"
            src="https://picsum.photos/seed/doctor/200/200"
          />
        </div>
        <div>
          <p class="text-sm font-semibold">{{ patientStore.invite?.doctorName }}</p>
          <p class="text-xs text-slate-500">{{ patientStore.invite?.specialty }}</p>
        </div>
      </div>
      <div class="space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-slate-500">Procedure:</span>
          <span class="font-medium">{{ patientStore.invite?.procedure }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-slate-500">Date:</span>
          <span class="font-medium">{{ patientStore.invite?.surgeryDate }}</span>
        </div>
      </div>
    </div>

    <div
      v-if="patientStore.invite?.hasPendingUpdate"
      class="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800"
    >
      A new care plan is waiting for your acceptance. Accepting it will activate the updated surgery plan, medicines, and diet recommendations.
    </div>

    <button
      class="mt-auto w-full rounded-2xl bg-blue-600 py-4 font-semibold text-white shadow-lg shadow-blue-200 transition-transform active:scale-95"
      type="button"
      @click="continueToSurgery"
    >
      {{ patientStore.invite?.hasPendingUpdate ? "Accept & Open Medical Consent" : "Open Medical Consent" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft, Bell } from "lucide-vue-next";

import { usePatientStore } from "@/stores/patient";
import { useSessionStore } from "@/stores/session";

const patientStore = usePatientStore();
const router = useRouter();
const sessionStore = useSessionStore();

const goBack = async () => {
  await sessionStore.advancePatientStage("empty");
  await router.push("/patient/empty");
};

const continueToSurgery = async () => {
  if (patientStore.invite?.hasPendingUpdate) {
    await patientStore.acceptInvite();
  }
  await sessionStore.advancePatientStage("surgery");
  await router.push("/patient/surgery");
};

onMounted(async () => {
  if (!patientStore.invite) {
    await patientStore.loadInvite();
  }
});
</script>
