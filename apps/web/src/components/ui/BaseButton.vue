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
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-[13px] font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
    props.block && "w-full",
    props.variant === "primary" && "theme-accent-bg active:scale-95",
    props.variant === "secondary" && "bg-slate-50 text-slate-700",
    props.variant === "ghost" && "bg-white text-slate-900",
    props.variant === "warm" && "bg-yellow-50 text-slate-900 shadow-sm",
  ),
);
</script>
