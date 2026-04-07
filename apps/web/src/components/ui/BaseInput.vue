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
      class="w-full rounded-[1.6rem] bg-white/85 px-4 py-3.5 text-sm text-slate-900 outline-none ring-1 ring-transparent transition focus:ring-[var(--brand-blue)]"
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
