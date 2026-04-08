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
          <p class="eyebrow">Diet</p>
          <h1 class="page-title text-2xl font-bold text-slate-900">Food guidance</h1>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div
          v-for="item in sortedDiet"
          :key="item.id"
          class="rounded-[1.8rem] p-5 shadow-xl shadow-slate-200/30"
          :class="dietClassName(item.type)"
        >
          <p class="text-lg font-semibold">{{ item.name }}</p>
          <p class="mt-2 text-xs font-bold uppercase tracking-[0.18em]">{{ item.type.replace('-', ' ') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";

import { dietClassName, sortDietItems } from "@/modules/shared/utils/carePlan";
import { usePatientStore } from "@/stores/patient";

const patientStore = usePatientStore();
const router = useRouter();
const sortedDiet = computed(() => sortDietItems(patientStore.diet));
</script>
