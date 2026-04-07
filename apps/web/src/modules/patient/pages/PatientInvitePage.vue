<template>
  <div class="space-y-8">
    <div class="space-y-3">
      <p class="eyebrow">Invitation</p>
      <h2 class="page-title text-3xl font-bold">Your surgeon has opened a preparation plan.</h2>
      <p class="muted-copy max-w-2xl text-sm leading-7">
        Review the upcoming procedure, confirm the assigned care team, and continue into the medical consent flow.
      </p>
    </div>

    <div class="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
      <section class="surface-soft rounded-[2rem] p-6">
        <p class="eyebrow">Assigned clinician</p>
        <h3 class="mt-4 text-2xl font-semibold text-slate-900">{{ patientStore.invite?.doctorName }}</h3>
        <p class="mt-1 text-sm text-[var(--text-muted)]">{{ patientStore.invite?.specialty }}</p>

        <div class="mt-8 grid gap-4 md:grid-cols-2">
          <div>
            <p class="eyebrow">Procedure</p>
            <p class="mt-2 text-lg font-semibold text-slate-900">{{ patientStore.invite?.procedure }}</p>
          </div>
          <div>
            <p class="eyebrow">Date</p>
            <p class="mt-2 text-lg font-semibold text-slate-900">{{ patientStore.invite?.surgeryDate }}</p>
          </div>
        </div>
      </section>

      <section class="surface-warm rounded-[2rem] p-6">
        <p class="eyebrow">Next step</p>
        <p class="mt-4 text-xl font-semibold text-slate-900">Open the procedure briefing</p>
        <p class="mt-3 text-sm leading-7 text-slate-700">
          This will summarize the surgery, expected recovery timing, and the preparation commitments required before the care team can clear you.
        </p>
      </section>
    </div>

    <BaseButton @click="continueToSurgery">
      Open Medical Briefing
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

const continueToSurgery = async () => {
  sessionStore.advancePatientStage("surgery");
  await router.push("/patient/surgery");
};

onMounted(async () => {
  if (!patientStore.invite) {
    await patientStore.loadInvite();
  }
});
</script>
