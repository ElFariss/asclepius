<template>
  <div class="flex h-full flex-col bg-white p-6">
    <div class="mb-6 flex items-center gap-2">
      <ShieldAlert class="text-red-600" />
      <h2 class="page-title text-xl font-bold">Legal Terms & Conditions</h2>
    </div>

    <div class="flex-1 space-y-6 overflow-y-auto pr-1">
      <div class="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <h3 class="mb-3 flex items-center gap-2 font-bold text-blue-900">
          <ClipboardList :size="18" />
          Mandatory Preparation List
        </h3>
        <p class="mb-4 text-xs text-blue-700">
          You are required to complete the following tasks daily before surgery:
        </p>
        <ul class="space-y-2">
          <li
            v-for="item in items"
            :key="item"
            class="flex items-center gap-2 text-xs font-medium text-blue-800"
          >
            <div class="h-1.5 w-1.5 rounded-full bg-blue-400" />
            {{ item }}
          </li>
        </ul>
      </div>

      <div class="relative overflow-hidden rounded-2xl border-2 border-red-500 bg-red-50 p-5">
        <div class="absolute top-0 right-0 p-2 opacity-10">
          <ShieldAlert :size="80" />
        </div>
        <h3 class="mb-3 font-bold uppercase tracking-tight text-red-900">Legal Liability Statement</h3>
        <div class="space-y-3 text-xs leading-relaxed text-red-800">
          <p class="font-bold">IMPORTANT: PLEASE READ CAREFULLY</p>
          <p>
            By agreeing to this document, you consciously accept that the success of the surgery depends heavily on your compliance with the provided medical preparation checklist.
          </p>
          <p class="rounded-lg border border-red-200 bg-red-100 p-2">
            <span class="font-bold">Liability Clause:</span>
            If medical complications occur due to patient non-compliance with pre-surgical instructions, the hospital and doctor cannot be held legally liable. All risks are the personal responsibility of the patient.
          </p>
          <p>
            Dishonesty in completing the checklist can endanger your life during anesthesia and surgery.
          </p>
        </div>
      </div>
    </div>

    <div class="mt-6 space-y-4">
      <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <input
          v-model="agreed"
          class="mt-1 h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-500"
          type="checkbox"
        />
        <span class="text-xs leading-tight text-slate-700">
          I understand and accept full legal responsibility for my surgical preparation compliance.
        </span>
      </label>

      <button
        :class="agreed ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'"
        class="w-full rounded-2xl py-4 font-semibold transition-all"
        :disabled="!agreed"
        type="button"
        @click="acceptConsent"
      >
        I Agree & Accept Responsibility
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ClipboardList, ShieldAlert } from "lucide-vue-next";

import { useSessionStore } from "@/stores/session";

const agreed = ref(false);
const router = useRouter();
const sessionStore = useSessionStore();

const items = [
  "Fast 8 hours before procedure",
  "Daily breathing exercises",
  "High protein intake",
  "Avoid smoking & alcohol",
];

const acceptConsent = async () => {
  sessionStore.acceptConsent();
  await router.push("/patient/dashboard");
};
</script>
