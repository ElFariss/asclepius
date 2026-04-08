<template>
  <div class="min-h-screen bg-[color:var(--surface-page)] px-4 py-6 md:px-8">
    <div class="w-full space-y-6">
      <div class="flex items-center gap-4">
        <button
          class="rounded-full border border-slate-200 bg-white p-3 text-slate-500 transition hover:text-slate-900"
          type="button"
          @click="router.push(`/doctor/patients/${route.params.id}`)"
        >
          <ArrowLeft :size="18" />
        </button>
        <div>
          <p class="eyebrow">Task tracker</p>
          <h1 class="page-title text-xl font-bold text-slate-900">{{ doctorStore.currentPatient?.name }} • {{ headerLabel }}</h1>
        </div>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section class="rounded-[1.7rem] bg-white p-5 shadow-2xl shadow-slate-200/60">
          <div class="mb-5 flex items-center justify-between">
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

        <section class="space-y-5">
          <div class="rounded-[1.7rem] bg-white p-5 shadow-xl shadow-slate-200/50">
            <div class="flex items-center justify-between">
              <div>
                <p class="eyebrow">Agenda</p>
                <h2 class="page-title text-lg font-bold text-slate-900">{{ agendaLabel }}</h2>
              </div>
              <span class="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                {{ selectedEvents.length }} items
              </span>
            </div>

            <div class="mt-5 space-y-3">
              <div
                v-for="event in selectedEvents"
                :key="event.id"
                class="rounded-xl bg-[color:var(--surface-subtle)] p-4"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="font-semibold text-slate-900">{{ event.title }}</p>
                    <p class="mt-2 text-[13px] leading-6 text-slate-600">{{ event.detail }}</p>
                  </div>
                  <span class="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    {{ eventTypeLabel(event.type) }}
                  </span>
                </div>
                <p class="mt-3 text-[11px] font-semibold text-slate-400">{{ describeEventTime(event) }}</p>
              </div>
              <p
                v-if="!selectedEvents.length"
                class="rounded-xl bg-[color:var(--surface-subtle)] px-4 py-6 text-[13px] text-slate-500"
              >
                No appointment, task, surgery, or medicine reminder is scheduled on this date.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>

    <div class="fixed right-6 bottom-6 z-30 flex flex-col items-end gap-3">
      <TransitionGroup name="route-fade">
        <button
          v-if="actionsOpen"
          key="appointment"
          class="rounded-full bg-white px-4 py-3 text-[12px] font-semibold text-slate-700 shadow-xl shadow-slate-200/60"
          type="button"
          @click="openComposer('appointment')"
        >
          Add appointment
        </button>
        <button
          v-if="actionsOpen"
          key="task"
          class="rounded-full bg-white px-4 py-3 text-[12px] font-semibold text-slate-700 shadow-xl shadow-slate-200/60"
          type="button"
          @click="openComposer('task')"
        >
          Add task
        </button>
        <button
          v-if="actionsOpen"
          key="medicine"
          class="rounded-full bg-white px-4 py-3 text-[12px] font-semibold text-slate-700 shadow-xl shadow-slate-200/60"
          type="button"
          @click="openComposer('medication')"
        >
          Add medicine
        </button>
      </TransitionGroup>

      <button
        class="theme-accent-bg flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl"
        type="button"
        @click="actionsOpen = !actionsOpen"
      >
        <Plus :size="24" />
      </button>
    </div>

    <ScheduleComposer
      :mode="composerMode"
      :medications="doctorStore.currentPatient?.medications ?? []"
      :open="composerOpen"
      @close="composerOpen = false"
      @save="saveSchedule"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, Plus } from "lucide-vue-next";

import MonthCalendarGrid from "@/components/calendar/MonthCalendarGrid.vue";
import ScheduleComposer from "@/components/calendar/ScheduleComposer.vue";
import { describeEventTime, eventTypeLabel, groupEventsByDate, monthLabel } from "@/modules/shared/utils/calendar";
import { useDoctorStore } from "@/stores/doctor";
import type { CalendarEventCreatePayload } from "@/types/domain";

const doctorStore = useDoctorStore();
const route = useRoute();
const router = useRouter();
const current = new Date();
const year = ref(current.getFullYear());
const monthIndex = ref(current.getMonth());
const selectedDate = ref(new Date(year.value, monthIndex.value, current.getDate()).toISOString().slice(0, 10));
const actionsOpen = ref(false);
const composerOpen = ref(false);
const composerMode = ref<"appointment" | "task" | "medication">("appointment");

const eventsByDate = computed(() => groupEventsByDate(doctorStore.currentCalendar?.events ?? []));
const selectedEvents = computed(() => eventsByDate.value[selectedDate.value] ?? []);
const headerLabel = computed(() => monthLabel(year.value, monthIndex.value));
const agendaLabel = computed(() =>
  new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(`${selectedDate.value}T00:00:00`)),
);

const loadCalendar = async (targetYear = year.value) => {
  await doctorStore.loadPatientCalendar(route.params.id.toString(), targetYear);
};

const changeMonth = async (direction: number) => {
  const next = new Date(year.value, monthIndex.value + direction, 1);
  const yearChanged = next.getFullYear() !== year.value;
  year.value = next.getFullYear();
  monthIndex.value = next.getMonth();
  selectedDate.value = new Date(year.value, monthIndex.value, 1).toISOString().slice(0, 10);
  if (yearChanged) {
    await loadCalendar(year.value);
  }
};

const openComposer = (mode: "appointment" | "task" | "medication") => {
  composerMode.value = mode;
  composerOpen.value = true;
  actionsOpen.value = false;
};

const saveSchedule = async (payload: CalendarEventCreatePayload) => {
  await doctorStore.createCalendarEvent(route.params.id.toString(), payload);
  composerOpen.value = false;
};

onMounted(async () => {
  await Promise.all([
    doctorStore.loadPatient(route.params.id.toString()),
    loadCalendar(),
  ]);
});
</script>
