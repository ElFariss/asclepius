<template>
  <label class="flex flex-col gap-2">
    <span
      v-if="label"
      class="eyebrow"
    >
      {{ label }}
    </span>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    modelValue: string;
    placeholder?: string;
    type?: string;
  }>(),
  {
    label: "",
    placeholder: "",
    type: "text",
  },
);

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>
