<template>
  <div class="space-y-8">
    <div class="space-y-3">
      <p class="eyebrow">Consent</p>
      <h2 class="page-title text-3xl font-bold">Legal responsibility and prep compliance</h2>
      <p class="muted-copy max-w-3xl text-sm leading-7">
        The team needs an explicit acknowledgement that pre-operative preparation directly affects anesthesia and surgical safety.
      </p>
    </div>

    <section class="surface-soft rounded-[2rem] p-6">
      <p class="eyebrow">Mandatory preparation list</p>
      <ul class="mt-4 grid gap-3 text-sm leading-7 text-slate-800 md:grid-cols-2">
        <li>Fast 8 hours before the procedure.</li>
        <li>Complete daily breathing exercises.</li>
        <li>Maintain a high-protein intake plan.</li>
        <li>Avoid smoking and alcohol.</li>
      </ul>
    </section>

    <section class="rounded-[2rem] bg-rose-50 p-6">
      <p class="eyebrow text-rose-700">Liability statement</p>
      <p class="mt-4 text-sm leading-8 text-rose-900">
        If medical complications occur because instructions were ignored or reported dishonestly, the resulting risk cannot be assigned to the hospital or clinician. The checklist must reflect the real state of preparation.
      </p>
    </section>

    <label class="surface-elevated flex items-start gap-4 rounded-[2rem] p-5">
      <input
        v-model="agreed"
        class="mt-1 h-5 w-5 rounded border-slate-300 text-[var(--brand-blue)]"
        type="checkbox"
      />
      <span class="text-sm leading-7 text-slate-800">
        I understand that surgical readiness depends on truthful compliance with the preparation plan and I accept responsibility for following the checklist accurately.
      </span>
    </label>

    <BaseButton
      :disabled="!agreed"
      @click="acceptConsent"
    >
      I Agree and Continue
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import BaseButton from "@/components/ui/BaseButton.vue";
import { useSessionStore } from "@/stores/session";

const agreed = ref(false);
const router = useRouter();
const sessionStore = useSessionStore();

const acceptConsent = async () => {
  sessionStore.acceptConsent();
  await router.push("/patient/dashboard");
};
</script>
