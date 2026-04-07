<template>
  <button
    :class="buttonClass"
    :disabled="disabled"
    :type="type"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "@/modules/shared/components/cn";

const props = withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "ghost" | "warm";
    block?: boolean;
    disabled?: boolean;
    type?: "button" | "submit";
  }>(),
  {
    variant: "primary",
    block: true,
    disabled: false,
    type: "button",
  },
);

const buttonClass = computed(() =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
    props.block && "w-full",
    props.variant === "primary" && "bg-[var(--brand-blue)] text-white shadow-[var(--shadow-soft)] hover:bg-[var(--brand-blue-deep)]",
    props.variant === "secondary" && "surface-soft text-[var(--brand-blue-deep)]",
    props.variant === "ghost" && "bg-white/50 text-[var(--text-primary)] hover:bg-white/80",
    props.variant === "warm" && "surface-warm text-slate-900",
  ),
);
</script>
