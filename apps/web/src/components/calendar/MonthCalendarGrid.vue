<template>
  <div class="space-y-3">
    <div class="grid grid-cols-7 gap-2 text-center">
      <p
        v-for="day in weekDays"
        :key="day"
        class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400"
      >
        {{ day }}
      </p>
    </div>

    <div class="grid grid-cols-7 gap-2">
      <button
        v-for="cell in cells"
        :key="cell.isoDate"
        class="min-h-24 rounded-xl border px-2 py-2 text-left transition"
        :class="[
          cell.isCurrentMonth ? 'bg-white' : 'bg-slate-50/80 text-slate-300',
          cell.isoDate === selectedDate
            ? 'border-[var(--theme-primary)] shadow-lg shadow-slate-200/70'
            : 'border-slate-200 hover:border-slate-300',
          cell.isToday && cell.isoDate !== selectedDate ? 'border-[color:var(--theme-primary)]' : '',
        ]"
        type="button"
        @click="$emit('select', cell.isoDate)"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold">{{ cell.dayNumber }}</span>
        </div>

        <div
          v-if="showPreview && eventsByDate[cell.isoDate]?.length"
          class="mt-2 space-y-1"
        >
          <p
            v-for="event in eventsByDate[cell.isoDate].slice(0, 2)"
            :key="event.id"
            class="truncate text-[10px] font-medium"
            :class="event.type === 'surgery'
              ? 'text-rose-600'
              : event.type === 'appointment'
                ? 'text-amber-600'
                : event.type === 'medication'
                  ? 'theme-accent-text'
                  : 'text-slate-600'"
          >
            {{ truncatePreview(event.previewText, 16) }}
          </p>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { buildMonthGrid, truncatePreview } from "@/modules/shared/utils/calendar";
import type { CalendarEvent } from "@/types/domain";

const props = withDefaults(
  defineProps<{
    year: number;
    monthIndex: number;
    eventsByDate?: Record<string, CalendarEvent[]>;
    selectedDate?: string;
    showPreview?: boolean;
    highlightToday?: boolean;
  }>(),
  {
    eventsByDate: () => ({}),
    selectedDate: "",
    showPreview: true,
    highlightToday: true,
  },
);

defineEmits<{
  (event: "select", value: string): void;
}>();

const cells = computed(() => buildMonthGrid(props.year, props.monthIndex));
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
</script>
