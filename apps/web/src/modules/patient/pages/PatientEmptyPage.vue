<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-white p-8">
    <div class="space-y-8 text-center">
      <div class="relative flex justify-center">
        <button
          class="relative z-10 flex h-32 w-32 items-center justify-center rounded-full border border-slate-100 bg-white text-blue-600 shadow-2xl transition hover:scale-105"
          type="button"
          @click="openInvitation"
        >
          <Mail
            :size="48"
            :stroke-width="1.5"
          />
          <span class="absolute top-4 right-4 h-5 w-5 rounded-full border-4 border-white bg-red-500 animate-pulse" />
        </button>
        <div class="absolute inset-0 scale-150 rounded-full bg-blue-400/20 blur-3xl animate-pulse" />
      </div>
      <div>
        <h2 class="page-title text-2xl font-bold text-slate-900">No Schedule Yet</h2>
        <p class="mt-2 mx-auto max-w-[240px] text-sm text-slate-500">
          Tap the mail icon to view invitations from your doctor.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Mail } from "lucide-vue-next";
import { useRouter } from "vue-router";

import { useSessionStore } from "@/stores/session";

const router = useRouter();
const sessionStore = useSessionStore();

const openInvitation = async () => {
  await sessionStore.advancePatientStage("invite");
  await router.push("/patient/invite");
};
</script>
