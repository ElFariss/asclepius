<template>
  <label class="flex flex-col gap-2">
    <span
      v-if="label"
      class="eyebrow inline-flex w-fit rounded-full bg-white/88 px-2.5 py-1 shadow-sm shadow-slate-200/60 ring-1 ring-slate-200/70"
    >
      {{ label }}
    </span>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      class="theme-input"
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
