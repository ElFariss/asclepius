<template>
  <div
    ref="root"
    class="relative"
  >
    <button
      class="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left text-[13px] text-slate-900"
      type="button"
      @click="open = !open"
    >
      <span>{{ label }}</span>
      <CalendarDays
        class="text-slate-400"
        :size="18"
      />
    </button>

    <div
      v-if="open"
      class="absolute top-[calc(100%+0.75rem)] left-0 z-30 w-full min-w-[20rem] rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/80"
    >
      <div class="mb-4 flex items-center justify-between">
        <button
          class="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
          type="button"
          @click="moveMonth(-1)"
        >
          Prev
        </button>
        <p class="page-title text-base font-bold text-slate-900">{{ headerLabel }}</p>
        <button
          class="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
          type="button"
          @click="moveMonth(1)"
        >
          Next
        </button>
      </div>

      <MonthCalendarGrid
        :events-by-date="{}"
        :highlight-today="true"
        :month-index="visibleMonth"
        :selected-date="modelValue"
        :show-preview="false"
        :year="visibleYear"
        @select="handleSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { CalendarDays } from "lucide-vue-next";

import MonthCalendarGrid from "@/components/calendar/MonthCalendarGrid.vue";
import { monthLabel } from "@/modules/shared/utils/calendar";

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const root = ref<HTMLElement | null>(null);
const open = ref(false);
const today = new Date();
const visibleMonth = ref(today.getMonth());
const visibleYear = ref(today.getFullYear());

watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      return;
    }
    const parsed = new Date(`${value}T00:00:00`);
    visibleMonth.value = parsed.getMonth();
    visibleYear.value = parsed.getFullYear();
  },
  { immediate: true },
);

const label = computed(() => {
  if (!props.modelValue) {
    return props.placeholder ?? "Choose a date";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${props.modelValue}T00:00:00`));
});

const headerLabel = computed(() => monthLabel(visibleYear.value, visibleMonth.value));

const moveMonth = (direction: number) => {
  const next = new Date(visibleYear.value, visibleMonth.value + direction, 1);
  visibleMonth.value = next.getMonth();
  visibleYear.value = next.getFullYear();
};

const handleSelect = (value: string) => {
  emit("update:modelValue", value);
  open.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (!root.value) {
    return;
  }
  if (!root.value.contains(event.target as Node)) {
    open.value = false;
  }
};

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
});
</script>
