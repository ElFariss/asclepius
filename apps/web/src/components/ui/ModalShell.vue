<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6"
    >
      <div class="w-full max-w-2xl rounded-[2rem] bg-white shadow-2xl">
        <div
          v-if="title || closeLabel"
          class="flex items-center justify-between border-b border-slate-100 px-6 py-4"
        >
          <div>
            <p
              v-if="title"
              class="page-title text-lg font-bold text-slate-900"
            >
              {{ title }}
            </p>
            <p
              v-if="description"
              class="mt-1 text-sm text-slate-500"
            >
              {{ description }}
            </p>
          </div>
          <button
            class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            type="button"
            @click="$emit('close')"
          >
            {{ closeLabel }}
          </button>
        </div>
        <div class="max-h-[80vh] overflow-y-auto">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
    description?: string;
    closeLabel?: string;
  }>(),
  {
    title: "",
    description: "",
    closeLabel: "Close",
  },
);

defineEmits<{
  (e: "close"): void;
}>();
</script>
