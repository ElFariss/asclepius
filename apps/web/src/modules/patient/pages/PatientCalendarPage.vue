<template>
  <div class="flex h-full flex-col bg-white">
    <div class="flex items-center gap-4 border-b border-slate-100 p-6">
      <button
        class="rounded-full p-2 transition-colors hover:bg-slate-100"
        type="button"
        @click="router.push('/patient/dashboard')"
      >
        <ArrowLeft :size="20" />
      </button>
      <div>
        <h2 class="page-title text-xl font-bold">Calendar</h2>
        <p class="text-sm text-slate-500">{{ patientStore.calendar?.monthLabel }}</p>
      </div>
    </div>

    <div class="flex-1 space-y-6 overflow-y-auto p-6">
      <div class="grid grid-cols-7 gap-2">
        <div
          v-for="day in weekDays"
          :key="day"
          class="py-2 text-center"
        >
          <p class="text-[10px] font-bold uppercase text-slate-400">{{ day }}</p>
        </div>
        <div class="col-span-2" />
        <button
          v-for="day in days"
          :key="day"
          class="relative flex aspect-square flex-col items-center justify-center rounded-xl border text-slate-600"
          :class="eventsByDay[day]?.length ? 'theme-accent-soft border-transparent' : 'border-slate-100 bg-white'"
          type="button"
          @click="selectedDay = day"
        >
          <span class="text-xs font-bold">{{ day }}</span>
          <div
            v-if="eventsByDay[day]?.length"
            class="mt-1 flex gap-0.5"
          >
            <div
              v-for="event in eventsByDay[day].slice(0, 3)"
              :key="event.id"
              class="h-1.5 w-1.5 rounded-full"
              :class="event.type === 'surgery' ? 'bg-rose-500' : event.type === 'appointment' ? 'bg-amber-500' : 'bg-[var(--theme-primary)]'"
            />
          </div>
        </button>
      </div>
    </div>

    <ModalShell
      :description="selectedDateLabel"
      :open="Boolean(selectedDay)"
      title="Day details"
      @close="selectedDay = null"
    >
      <div class="space-y-3 p-6">
        <div
          v-for="event in selectedEvents"
          :key="event.id"
          class="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4"
        >
          <p class="font-semibold text-slate-900">{{ event.title }}</p>
          <p class="mt-2 text-sm leading-7 text-slate-600">{{ event.detail }}</p>
          <p class="mt-2 text-xs font-bold uppercase tracking-[0.18em]" :class="event.type === 'surgery' ? 'text-rose-600' : event.type === 'appointment' ? 'text-amber-600' : 'theme-accent-text'">
            {{ event.type }}
          </p>
        </div>
        <p
          v-if="!selectedEvents.length"
          class="text-sm text-slate-500"
        >
          No medication or appointment is scheduled for this day.
        </p>
      </div>
    </ModalShell>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";

import ModalShell from "@/components/ui/ModalShell.vue";
import { usePatientStore } from "@/stores/patient";
import type { CalendarEvent } from "@/types/domain";

const patientStore = usePatientStore();
const router = useRouter();
const selectedDay = ref<number | null>(null);

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const days = Array.from({ length: 30 }, (_, index) => index + 1);

const eventsByDay = computed(() => {
  const grouped: Record<number, CalendarEvent[]> = {};
  patientStore.calendar?.events.forEach((event) => {
    const day = Number(event.date.slice(-2));
    grouped[day] ??= [];
    grouped[day].push(event);
  });
  return grouped;
});

const selectedEvents = computed(() => (selectedDay.value ? eventsByDay.value[selectedDay.value] ?? [] : []));
const selectedDateLabel = computed(() =>
  selectedDay.value ? `April ${selectedDay.value}, 2026` : "",
);

onMounted(async () => {
  if (!patientStore.calendar) {
    await patientStore.loadDashboard();
  }
});
</script>
