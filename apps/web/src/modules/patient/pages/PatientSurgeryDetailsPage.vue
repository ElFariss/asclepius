<template>
  <div class="space-y-8">
    <div class="space-y-3">
      <p class="eyebrow">Procedure briefing</p>
      <h2 class="page-title text-3xl font-bold">{{ patientStore.profile?.procedure }}</h2>
      <p class="muted-copy max-w-3xl text-sm leading-7">
        Laparoscopic cholecystectomy is a minimally invasive operation using small abdominal incisions for camera-guided removal of the gallbladder.
      </p>
    </div>

    <div class="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <section class="surface-elevated rounded-[2rem] p-6">
        <p class="eyebrow">Care team</p>
        <h3 class="mt-4 text-2xl font-semibold text-slate-900">{{ patientStore.profile?.attendingDoctor }}</h3>
        <p class="mt-1 text-sm text-[var(--text-muted)]">{{ patientStore.profile?.specialty }}</p>
      </section>

      <section class="surface-soft rounded-[2rem] p-6">
        <div class="grid gap-6 md:grid-cols-2">
          <div>
            <p class="eyebrow">Surgery duration</p>
            <p class="mt-2 text-xl font-semibold text-slate-900">{{ patientStore.profile?.surgeryDuration }}</p>
          </div>
          <div>
            <p class="eyebrow">Expected stay</p>
            <p class="mt-2 text-xl font-semibold text-slate-900">{{ patientStore.profile?.hospitalStay }}</p>
          </div>
        </div>
      </section>
    </div>

    <section class="surface-warm rounded-[2rem] p-6">
      <p class="eyebrow">What matters before surgery</p>
      <ul class="mt-4 grid gap-4 text-sm leading-7 text-slate-800 md:grid-cols-2">
        <li>Maintain accurate daily checklist completion.</li>
        <li>Follow fasting and medication instructions exactly.</li>
        <li>Continue breathing exercises and mobility preparation.</li>
        <li>Surface any concerns before the next consultation.</li>
      </ul>
    </section>

    <BaseButton @click="continueToConsent">
      Continue to Legal Consent
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

import BaseButton from "@/components/ui/BaseButton.vue";
import { usePatientStore } from "@/stores/patient";
import { useSessionStore } from "@/stores/session";

const patientStore = usePatientStore();
const router = useRouter();
const sessionStore = useSessionStore();

const continueToConsent = async () => {
  sessionStore.advancePatientStage("consent");
  await router.push("/patient/consent");
};

onMounted(async () => {
  if (!patientStore.profile) {
    await patientStore.loadDashboard();
  }
});
</script>
