<template>
  <div class="min-h-screen bg-[color:var(--surface-page)] px-4 py-6 md:px-8">
    <div class="w-full space-y-6">
      <div class="flex items-center gap-4">
        <button
          class="rounded-full border border-slate-200 bg-white p-3 text-slate-500 transition hover:text-slate-900"
          type="button"
          @click="router.push('/patient/dashboard')"
        >
          <ArrowLeft :size="18" />
        </button>
        <div>
          <p class="eyebrow">Calendar</p>
          <h1 class="page-title text-2xl font-bold text-slate-900">{{ headerLabel }}</h1>
        </div>
      </div>

      <section class="rounded-[1.7rem] bg-white p-5 shadow-2xl shadow-slate-200/60">
        <div class="mb-6 flex items-center justify-between">
          <button
            class="rounded-full border border-slate-200 px-4 py-3 text-[13px] font-semibold text-slate-700"
            type="button"
            @click="changeMonth(-1)"
          >
            Previous
          </button>
          <p class="page-title text-lg font-bold text-slate-900">{{ headerLabel }}</p>
          <button
            class="rounded-full border border-slate-200 px-4 py-3 text-[13px] font-semibold text-slate-700"
            type="button"
            @click="changeMonth(1)"
          >
            Next
          </button>
        </div>

        <MonthCalendarGrid
          :events-by-date="eventsByDate"
          :month-index="monthIndex"
          :selected-date="selectedDate"
          :year="year"
          @select="selectedDate = $event"
        />
      </section>

      <section class="rounded-[1.7rem] bg-white p-5 shadow-xl shadow-slate-200/50">
        <div class="flex items-center justify-between">
          <div>
            <p class="eyebrow">Agenda</p>
            <h2 class="page-title text-lg font-bold text-slate-900">{{ agendaLabel }}</h2>
          </div>
          <span class="rounded-full bg-slate-100 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            {{ selectedEvents.length }} items
          </span>
        </div>

        <div class="mt-6 space-y-3">
          <div
            v-for="event in selectedEvents"
            :key="event.id"
            class="rounded-xl border border-slate-100 bg-slate-50 p-4"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="font-semibold text-slate-900">{{ event.title }}</p>
                <p class="mt-2 text-[13px] leading-6 text-slate-600">{{ event.detail }}</p>
              </div>
              <span
                class="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
                :class="event.type === 'surgery'
                  ? 'bg-rose-50 text-rose-600'
                  : event.type === 'appointment'
                    ? 'bg-amber-50 text-amber-700'
                    : event.type === 'medication'
                      ? 'theme-accent-soft'
                      : 'bg-slate-100 text-slate-600'"
              >
                {{ eventTypeLabel(event.type) }}
              </span>
            </div>
            <p class="mt-3 text-[11px] font-semibold text-slate-400">{{ describeEventTime(event) }}</p>
          </div>

          <p
            v-if="!selectedEvents.length"
            class="rounded-xl bg-slate-50 px-4 py-6 text-[13px] text-slate-500"
          >
            No tasks, appointments, surgeries, or medicine reminders are scheduled on this date.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";

import MonthCalendarGrid from "@/components/calendar/MonthCalendarGrid.vue";
import { describeEventTime, eventTypeLabel, groupEventsByDate, monthLabel } from "@/modules/shared/utils/calendar";
import { usePatientStore } from "@/stores/patient";

const patientStore = usePatientStore();
const router = useRouter();
const current = new Date();
const year = ref(patientStore.calendar?.year ?? current.getFullYear());
const monthIndex = ref((patientStore.calendar?.focusMonth ?? current.getMonth() + 1) - 1);
const selectedDate = ref(new Date(year.value, monthIndex.value, current.getDate()).toISOString().slice(0, 10));

const eventsByDate = computed(() => groupEventsByDate(patientStore.calendar?.events ?? []));
const selectedEvents = computed(() => eventsByDate.value[selectedDate.value] ?? []);
const headerLabel = computed(() => monthLabel(year.value, monthIndex.value));
const agendaLabel = computed(() =>
  new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(`${selectedDate.value}T00:00:00`)),
);

const changeMonth = async (direction: number) => {
  const next = new Date(year.value, monthIndex.value + direction, 1);
  year.value = next.getFullYear();
  monthIndex.value = next.getMonth();
  await patientStore.loadCalendar(year.value, monthIndex.value + 1);
  selectedDate.value = new Date(year.value, monthIndex.value, 1).toISOString().slice(0, 10);
};

watch(
  () => patientStore.calendar,
  (value) => {
    if (!value) {
      return;
    }
    year.value = value.year;
    monthIndex.value = value.focusMonth - 1;
  },
  { immediate: true },
);
</script>
