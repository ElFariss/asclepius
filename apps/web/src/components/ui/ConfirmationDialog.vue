<template>
  <ModalShell
    :description="description"
    :open="open"
    :title="title"
    @close="$emit('cancel')"
  >
    <div class="space-y-5 p-6">
      <p class="text-[13px] leading-6 text-slate-600">{{ message }}</p>
      <div class="flex gap-3">
        <button
          class="w-full rounded-xl bg-slate-100 px-4 py-3 text-[13px] font-semibold text-slate-700"
          type="button"
          @click="$emit('cancel')"
        >
          Cancel
        </button>
        <button
          class="theme-accent-bg w-full rounded-xl px-4 py-3 text-[13px] font-semibold"
          type="button"
          @click="$emit('confirm')"
        >
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </ModalShell>
</template>

<script setup lang="ts">
import ModalShell from "@/components/ui/ModalShell.vue";

withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    description?: string;
    message: string;
    confirmLabel?: string;
  }>(),
  {
    description: "",
    confirmLabel: "Confirm",
  },
);

defineEmits<{
  (event: "confirm"): void;
  (event: "cancel"): void;
}>();
</script>
