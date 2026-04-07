<template>
  <div class="flex items-center gap-3">
    <div class="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-[var(--brand-blue)] text-white shadow-[var(--shadow-soft)]">
      <HeartPulse class="h-6 w-6" />
    </div>
    <div>
      <p class="page-title text-lg font-bold">Asclepius</p>
      <p class="muted-copy text-sm">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HeartPulse } from "lucide-vue-next";

defineProps<{
  subtitle: string;
}>();
</script>
