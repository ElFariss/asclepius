<template>
  <div
    v-if="doctorStore.currentPatient"
    class="min-h-screen bg-[color:var(--surface-page)] px-4 py-6 md:px-8"
  >
    <div class="w-full space-y-6">
      <section class="rounded-[1.7rem] bg-white p-5 shadow-2xl shadow-slate-200/60 md:p-6">
        <div class="flex items-center gap-4">
          <button
            class="rounded-full border border-slate-200 bg-white p-3 text-slate-500 transition hover:text-slate-900"
            type="button"
            @click="router.push('/doctor/dashboard')"
          >
            <ArrowLeft :size="18" />
          </button>
          <div class="flex items-center gap-4">
            <div class="h-14 w-14 overflow-hidden rounded-2xl bg-slate-100">
              <img
                v-if="doctorStore.currentPatient.avatarUrl"
                :src="doctorStore.currentPatient.avatarUrl"
                alt="Patient profile"
                class="h-full w-full object-cover"
              />
              <div
                v-else
                class="theme-accent-soft flex h-full w-full items-center justify-center text-lg font-bold"
              >
                {{ doctorStore.currentPatient.name.charAt(0) }}
              </div>
            </div>
            <div>
              <p class="page-title text-xl font-bold text-slate-900">{{ doctorStore.currentPatient.name }}</p>
              <p class="text-[13px] text-slate-500">{{ doctorStore.currentPatient.procedure }}</p>
            </div>
          </div>
        </div>

        <div class="mt-6 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-[1.35rem] bg-[color:var(--surface-subtle)] p-4">
                <p class="eyebrow">Compliance</p>
                <p class="page-title mt-2 text-[1.7rem] font-bold theme-accent-text">{{ doctorStore.currentPatient.compliance }}%</p>
              </div>
              <div class="rounded-[1.35rem] bg-[color:var(--surface-subtle)] p-4">
                <p class="eyebrow">Risk</p>
                <p
                  class="page-title mt-2 text-[1.7rem] font-bold"
                  :class="doctorStore.currentPatient.risk === 'High' ? 'text-rose-600' : doctorStore.currentPatient.risk === 'Medium' ? 'text-yellow-700' : 'theme-accent-text'"
                >
                  {{ doctorStore.currentPatient.risk }}
                </p>
              </div>
            </div>

            <div class="rounded-[1.45rem] bg-white p-3 shadow-xl shadow-slate-200/40">
              <div class="mb-3 flex items-center justify-between px-3 pt-2">
                <h3 class="page-title text-base font-bold text-slate-900">Last 7 days compliance trend</h3>
                <p class="text-[11px] font-semibold text-slate-400">{{ doctorStore.currentPatient.progress.length }} points</p>
              </div>
              <div class="h-56 w-full">
                <TrendChart
                  :labels="labels"
                  :values="compliance"
                  color="var(--theme-primary)"
                />
              </div>
            </div>

            <div
              v-if="doctorStore.currentPatient.risk === 'High'"
              class="rounded-[1.45rem] border border-rose-100 bg-rose-50 p-5"
            >
              <div class="mb-4 flex gap-3">
                <AlertCircle class="shrink-0 text-rose-500" />
                <div>
                  <p class="text-[13px] font-bold text-rose-900">High risk warning</p>
                  <p class="text-[12px] leading-6 text-rose-700">
                    Patient compliance is below 50%. Risk of complications is significantly increased.
                  </p>
                </div>
              </div>
              <button class="w-full rounded-xl bg-white px-4 py-3 text-[13px] font-semibold text-rose-700" type="button">
                Contact Patient
              </button>
            </div>
          </div>

          <div class="space-y-6">
            <section class="rounded-[1.45rem] bg-white p-5 shadow-xl shadow-slate-200/50">
              <div class="mb-4 flex items-center justify-between">
                <div>
                  <p class="eyebrow">Task tracker</p>
                  <h3 class="page-title text-base font-bold text-slate-900">Current preparation snapshot</h3>
                </div>
                <button
                  class="text-[12px] font-semibold theme-accent-text"
                  type="button"
                  @click="router.push(`/doctor/patients/${route.params.id}/calendar`)"
                >
                  View Calendar
                </button>
              </div>

              <div class="rounded-[1.35rem] border border-slate-100 bg-[color:var(--surface-subtle)] p-4">
                <div class="grid grid-cols-7 gap-2">
                  <button
                    v-for="day in weekDays"
                    :key="day.isoDate"
                    class="text-center"
                    type="button"
                    @click="selectedDate = day.isoDate"
                  >
                    <p class="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{{ day.label }}</p>
                    <div
                      class="mx-auto flex h-9 w-9 items-center justify-center rounded-full border text-[12px] font-bold transition"
                      :class="day.isoDate === selectedDate || day.isToday
                        ? 'border-[color:var(--theme-primary)] bg-white text-slate-900 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600'"
                    >
                      {{ day.dayNumber }}
                    </div>
                    <div class="mt-1.5 flex justify-center gap-1">
                      <div
                        class="h-1.5 w-1.5 rounded-full"
                        :class="day.eventCount >= 1 ? 'bg-blue-600' : 'bg-slate-200'"
                      />
                      <div
                        class="h-1.5 w-1.5 rounded-full"
                        :class="day.eventCount >= 2 ? 'bg-blue-600' : 'bg-slate-200'"
                      />
                    </div>
                  </button>
                </div>

                <button
                  class="mt-4 flex w-full items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-3 text-left"
                  type="button"
                  @click="router.push(`/doctor/patients/${route.params.id}/calendar`)"
                >
                  <div class="flex items-center gap-3">
                    <div class="theme-accent-soft flex h-9 w-9 items-center justify-center rounded-xl">
                      <Clock :size="16" />
                    </div>
                    <div>
                      <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Next appointment</p>
                      <p class="text-[13px] font-bold text-slate-900">{{ nextAppointmentTitle }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-[11px] text-slate-400">{{ nextAppointmentLabel }}</p>
                    <ChevronRight class="ml-auto mt-1 text-slate-300" :size="16" />
                  </div>
                </button>

                <div class="mt-4 flex justify-end">
                  <div class="relative flex flex-col items-end gap-2">
                    <TransitionGroup name="route-fade">
                      <button
                        v-if="actionsOpen"
                        key="task"
                        class="rounded-full bg-white px-4 py-2.5 text-[12px] font-semibold text-slate-700 shadow-lg shadow-slate-200/60"
                        type="button"
                        @click="openComposer('task')"
                      >
                        Add task
                      </button>
                      <button
                        v-if="actionsOpen"
                        key="appointment"
                        class="rounded-full bg-white px-4 py-2.5 text-[12px] font-semibold text-slate-700 shadow-lg shadow-slate-200/60"
                        type="button"
                        @click="openComposer('appointment')"
                      >
                        Add appointment
                      </button>
                      <button
                        v-if="actionsOpen"
                        key="medicine"
                        class="rounded-full bg-white px-4 py-2.5 text-[12px] font-semibold text-slate-700 shadow-lg shadow-slate-200/60"
                        type="button"
                        @click="openComposer('medication')"
                      >
                        Add medicine
                      </button>
                    </TransitionGroup>
                    <button
                      class="theme-accent-bg flex h-12 w-12 items-center justify-center rounded-full text-white"
                      type="button"
                      @click="actionsOpen = !actionsOpen"
                    >
                      <Plus :size="20" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section class="rounded-[1.45rem] bg-white p-5 shadow-xl shadow-slate-200/50">
              <div class="mb-4 flex items-center justify-between">
                <div>
                  <p class="eyebrow">Tasks</p>
                  <h3 class="page-title text-base font-bold text-slate-900">Today's patient tasks</h3>
                </div>
              </div>

              <div class="space-y-3">
                <div
                  v-for="task in doctorStore.currentPatient.tasks"
                  :key="task.id"
                  class="flex items-center justify-between rounded-xl bg-[color:var(--surface-subtle)] px-4 py-4"
                >
                  <div>
                    <p class="text-[14px] font-semibold text-slate-900">{{ task.title }}</p>
                    <p class="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">{{ task.time }}</p>
                  </div>
                  <span
                    class="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]"
                    :class="task.completed ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'"
                  >
                    {{ task.completed ? "Done" : "Pending" }}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section class="rounded-[1.7rem] bg-white p-5 shadow-xl shadow-slate-200/50">
        <h3 class="page-title text-lg font-bold text-slate-900">Surgery decision</h3>
        <p class="mt-2 text-[13px] text-slate-500">
          Choose whether the operation should proceed or be postponed. Clicking the active choice again clears it back to none.
        </p>

        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <button
            class="rounded-[1.35rem] px-5 py-5 text-left transition"
            :class="doctorStore.currentPatient.surgeryDecision === 'proceed'
              ? 'bg-blue-600 text-white shadow-xl shadow-blue-200/70'
              : 'bg-blue-50 text-blue-700'"
            type="button"
            @click="toggleDecision('proceed')"
          >
            <CheckCircle :size="20" />
            <p class="mt-3 text-base font-semibold">Proceed</p>
            <p class="mt-2 text-[13px] opacity-80">Continue with the current operation plan.</p>
          </button>
          <button
            class="rounded-[1.35rem] px-5 py-5 text-left transition"
            :class="doctorStore.currentPatient.surgeryDecision === 'postpone'
              ? 'bg-amber-500 text-white shadow-xl shadow-amber-200/70'
              : 'bg-amber-50 text-amber-700'"
            type="button"
            @click="toggleDecision('postpone')"
          >
            <Clock :size="20" />
            <p class="mt-3 text-base font-semibold">Postpone</p>
            <p class="mt-2 text-[13px] opacity-80">Delay surgery until readiness improves.</p>
          </button>
        </div>

        <p class="mt-4 text-[11px] text-slate-400">Current decision: {{ doctorStore.currentPatient.surgeryDecision }}</p>
      </section>
    </div>

    <ScheduleComposer
      :mode="composerMode"
      :medications="doctorStore.currentPatient.medications"
      :open="composerOpen"
      @close="composerOpen = false"
      @save="saveSchedule"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Clock,
  Plus,
} from "lucide-vue-next";

import ScheduleComposer from "@/components/calendar/ScheduleComposer.vue";
import TrendChart from "@/components/charts/TrendChart.vue";
import { describeEventTime, groupEventsByDate } from "@/modules/shared/utils/calendar";
import { useDoctorStore } from "@/stores/doctor";
import type { CalendarEventCreatePayload, SurgeryDecision } from "@/types/domain";

const doctorStore = useDoctorStore();
const route = useRoute();
const router = useRouter();
const todayIso = new Date().toISOString().slice(0, 10);
const selectedDate = ref(todayIso);
const actionsOpen = ref(false);
const composerOpen = ref(false);
const composerMode = ref<"appointment" | "task" | "medication">("appointment");

const labels = computed(() => doctorStore.currentPatient?.progress.map((point) => point.day) ?? []);
const compliance = computed(() => doctorStore.currentPatient?.progress.map((point) => point.compliance) ?? []);
const eventsByDate = computed(() => groupEventsByDate(doctorStore.currentCalendar?.events ?? []));

const weekDays = computed(() => {
  const reference = new Date(`${selectedDate.value}T00:00:00`);
  const day = (reference.getDay() + 6) % 7;
  const monday = new Date(reference);
  monday.setDate(reference.getDate() - day);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const value = new Date(monday);
    value.setDate(monday.getDate() + index);
    const isoDate = value.toISOString().slice(0, 10);
    return {
      isoDate,
      label: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(value),
      dayNumber: value.getDate(),
      isToday: isoDate === todayIso,
      eventCount: Math.min((eventsByDate.value[isoDate] ?? []).length, 2),
    };
  });
});

const nextAppointment = computed(() => {
  const now = Date.now();
  const upcoming = [...(doctorStore.currentCalendar?.events ?? [])]
    .filter((event) => {
      const source = event.startAt ?? `${event.date}T00:00:00`;
      return new Date(source).getTime() >= now;
    })
    .sort((left, right) => {
      const leftTime = new Date(left.startAt ?? `${left.date}T00:00:00`).getTime();
      const rightTime = new Date(right.startAt ?? `${right.date}T00:00:00`).getTime();
      return leftTime - rightTime;
    });

  return upcoming.find((event) => event.type === "appointment") ?? upcoming[0] ?? null;
});

const nextAppointmentTitle = computed(() => nextAppointment.value?.title ?? "No appointment scheduled");

const nextAppointmentLabel = computed(() => {
  if (!nextAppointment.value) {
    return "Add one from the tracker";
  }

  const source = new Date(nextAppointment.value.startAt ?? `${nextAppointment.value.date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (source.toDateString() === today.toDateString()) {
    return describeEventTime(nextAppointment.value);
  }
  if (source.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow, ${describeEventTime(nextAppointment.value)}`;
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(source);
});

const openComposer = (mode: "appointment" | "task" | "medication") => {
  composerMode.value = mode;
  composerOpen.value = true;
  actionsOpen.value = false;
};

const saveSchedule = async (payload: CalendarEventCreatePayload) => {
  await doctorStore.createCalendarEvent(route.params.id.toString(), payload);
  composerOpen.value = false;
};

const toggleDecision = async (decision: SurgeryDecision) => {
  if (!doctorStore.currentPatient) {
    return;
  }
  await doctorStore.setSurgeryDecision(
    doctorStore.currentPatient.id,
    doctorStore.currentPatient.surgeryDecision,
    decision,
  );
};

onMounted(async () => {
  await Promise.all([
    doctorStore.loadPatient(route.params.id.toString()),
    doctorStore.loadPatientCalendar(route.params.id.toString(), new Date().getFullYear()),
  ]);
});
</script>
