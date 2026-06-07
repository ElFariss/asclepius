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
              <button
                class="rounded-[1.35rem] p-4 text-left transition"
                :class="showCompliance ? 'theme-accent-soft ring-1 ring-[color:var(--theme-primary)]' : 'bg-[color:var(--surface-subtle)]'"
                type="button"
                @click="showCompliance = !showCompliance"
              >
                <p class="eyebrow">Compliance</p>
                <p class="page-title mt-2 text-[1.7rem] font-bold theme-accent-text">{{ doctorStore.currentPatient.compliance }}%</p>
              </button>
              <button
                class="rounded-[1.35rem] p-4 text-left transition"
                :class="showRisk ? 'bg-rose-50 ring-1 ring-rose-200' : 'bg-[color:var(--surface-subtle)]'"
                type="button"
                @click="showRisk = !showRisk"
              >
                <p class="eyebrow">Risk</p>
                <p
                  class="page-title mt-2 text-[1.7rem] font-bold"
                  :class="riskTextClass"
                >
                  {{ doctorStore.currentPatient.risk }}
                </p>
              </button>
            </div>

            <div class="rounded-[1.45rem] bg-white p-3 shadow-xl shadow-slate-200/40">
              <div class="mb-3 flex items-center justify-between gap-3 px-3 pt-2">
                <div>
                  <h3 class="page-title text-base font-bold text-slate-900">Readiness metrics</h3>
                  <p class="text-[11px] font-semibold text-slate-400">{{ doctorStore.currentPatient.metrics.length }} points</p>
                </div>
                <button
                  class="theme-accent-soft flex h-10 w-10 items-center justify-center rounded-full"
                  type="button"
                  @click="chatStore.openThread(doctorStore.currentPatient.id, `${doctorStore.currentPatient.name} Chat`)"
                >
                  <MessageCircle :size="18" />
                </button>
              </div>
              <div class="h-56 w-full">
                <MultiMetricChart
                  v-if="metricSeries.length"
                  :series="metricSeries"
                />
                <div
                  v-else
                  class="flex h-full items-center justify-center rounded-[1.1rem] bg-[color:var(--surface-subtle)] text-[12px] text-slate-500"
                >
                  Select Compliance, Risk, or both.
                </div>
              </div>
            </div>

            <div
              v-if="doctorStore.currentPatient.risk === 'Intervene'"
              class="rounded-[1.45rem] border border-rose-100 bg-rose-50 p-5"
            >
              <div class="flex gap-3">
                <AlertCircle class="shrink-0 text-rose-500" />
                <div>
                  <p class="text-[13px] font-bold text-rose-900">Intervention required</p>
                  <p class="text-[12px] leading-6 text-rose-700">
                    Patient readiness is below target. Review tasks, checkup notes, and contact the patient if needed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <section class="rounded-[1.45rem] bg-white p-5 shadow-xl shadow-slate-200/50">
              <div class="mb-4 flex items-center justify-between">
                <div>
                  <p class="eyebrow">Task tracker</p>
                  <h3 class="page-title text-base font-bold text-slate-900">Task tracker</h3>
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
                    class="rounded-xl py-2 text-center transition"
                    :class="dayButtonClass(day)"
                    type="button"
                    @click="selectedDate = day.isoDate"
                  >
                    <p class="mb-2 text-[10px] font-bold uppercase tracking-[0.16em]">{{ day.label }}</p>
                    <div class="mx-auto flex h-9 w-9 items-center justify-center rounded-full border bg-white text-[12px] font-bold">
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
                    <ChevronRight
                      class="ml-auto mt-1 text-slate-300"
                      :size="16"
                    />
                  </div>
                </button>
              </div>

              <div class="mt-4 space-y-3">
                <div
                  v-for="event in selectedEvents"
                  :key="event.id"
                  class="rounded-xl bg-[color:var(--surface-subtle)] px-4 py-4"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="text-[14px] font-semibold text-slate-900">{{ event.title }}</p>
                      <p
                        v-if="event.variableName"
                        class="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] theme-accent-text"
                      >
                        {{ event.variableName }}
                      </p>
                      <p class="mt-2 text-[12px] leading-5 text-slate-500">{{ event.detail }}</p>
                    </div>
                    <span class="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      {{ eventTypeLabel(event.type) }}
                    </span>
                  </div>
                  <p class="mt-3 text-[11px] font-semibold text-slate-400">{{ describeEventTime(event) }}</p>
                </div>
                <p
                  v-if="!selectedEvents.length"
                  class="rounded-xl bg-[color:var(--surface-subtle)] px-4 py-5 text-[13px] text-slate-500"
                >
                  No items scheduled for {{ selectedDayLabel }}.
                </p>
              </div>
            </section>

            <section class="rounded-[1.45rem] bg-white p-5 shadow-xl shadow-slate-200/50">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="eyebrow">Latest checkup</p>
                  <h3 class="page-title text-base font-bold text-slate-900">{{ latestCheckupDate }}</h3>
                  <p class="mt-3 text-[13px] leading-6 text-slate-600">{{ latestCheckupSummary }}</p>
                </div>
                <button
                  class="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-semibold text-slate-700"
                  type="button"
                  @click="openCheckupEditor"
                >
                  Edit
                </button>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section class="rounded-[1.7rem] bg-white p-5 shadow-xl shadow-slate-200/50">
        <h3 class="page-title text-lg font-bold text-slate-900">Surgery decision</h3>
        <p class="mt-2 text-[13px] text-slate-500">
          Choose whether the operation should proceed or be postponed. Press the active choice again to clear it.
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

    <ModalShell
      :open="checkupOpen"
      description="Save the most recent medical checkup note for this patient."
      title="Latest checkup"
      @close="checkupOpen = false"
    >
      <div class="space-y-4 p-6">
        <label class="block space-y-2">
          <span class="eyebrow">Date</span>
          <DatePickerField
            v-model="checkupForm.date"
            placeholder="Choose checkup date"
          />
        </label>
        <label class="block space-y-2">
          <span class="eyebrow">Summary</span>
          <textarea
            v-model="checkupForm.summary"
            class="min-h-28 w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-900 outline-none"
            placeholder="Latest vitals, lab result, or consultation note"
          />
        </label>
        <div class="flex justify-end gap-3">
          <button
            class="rounded-[1rem] bg-slate-100 px-4 py-3 text-[13px] font-semibold text-slate-700"
            type="button"
            @click="checkupOpen = false"
          >
            Cancel
          </button>
          <button
            class="theme-accent-bg rounded-[1rem] px-4 py-3 text-[13px] font-semibold text-white"
            type="button"
            @click="saveCheckup"
          >
            Save
          </button>
        </div>
      </div>
    </ModalShell>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Clock,
  MessageCircle,
} from "lucide-vue-next";

import DatePickerField from "@/components/calendar/DatePickerField.vue";
import MultiMetricChart from "@/components/charts/MultiMetricChart.vue";
import ModalShell from "@/components/ui/ModalShell.vue";
import { describeEventTime, eventTypeLabel, groupEventsByDate } from "@/modules/shared/utils/calendar";
import { useChatStore } from "@/stores/chat";
import { useDoctorStore } from "@/stores/doctor";
import type { CalendarEvent, MetricSeries, SurgeryDecision } from "@/types/domain";

const doctorStore = useDoctorStore();
const chatStore = useChatStore();
const route = useRoute();
const router = useRouter();

const todayIso = localIsoDate(new Date());
const selectedDate = ref(todayIso);
const showCompliance = ref(true);
const showRisk = ref(false);
const checkupOpen = ref(false);
const checkupForm = reactive({
  date: todayIso,
  summary: "",
});

const labels = computed(() => doctorStore.currentPatient?.metrics.map((point) => point.day) ?? []);
const compliance = computed(() => doctorStore.currentPatient?.metrics.map((point) => point.compliance) ?? []);
const risk = computed(() => doctorStore.currentPatient?.metrics.map((point) => point.risk) ?? []);
const eventsByDate = computed(() => groupEventsByDate(doctorStore.currentCalendar?.events ?? []));
const selectedEvents = computed(() => eventsByDate.value[selectedDate.value] ?? []);
const selectedIsToday = computed(() => selectedDate.value === todayIso);

const metricSeries = computed<MetricSeries[]>(() => {
  const series: MetricSeries[] = [];
  if (showCompliance.value) {
    series.push({
      patientId: doctorStore.currentPatient?.id ?? "",
      name: "Compliance",
      color: "#1565d8",
      labels: labels.value,
      values: compliance.value,
    });
  }
  if (showRisk.value) {
    series.push({
      patientId: doctorStore.currentPatient?.id ?? "",
      name: "Risk",
      color: "#e11d48",
      labels: labels.value,
      values: risk.value,
    });
  }
  return series;
});

const riskTextClass = computed(() => {
  if (doctorStore.currentPatient?.risk === "Intervene") {
    return "text-rose-600";
  }
  if (doctorStore.currentPatient?.risk === "Borderline") {
    return "text-yellow-700";
  }
  return "text-emerald-600";
});

const weekDays = computed(() => {
  const reference = new Date(`${todayIso}T00:00:00`);
  const day = (reference.getDay() + 6) % 7;
  const monday = new Date(reference);
  monday.setDate(reference.getDate() - day);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const value = new Date(monday);
    value.setDate(monday.getDate() + index);
    const isoDate = localIsoDate(value);
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
    .sort((left, right) => eventTimestamp(left) - eventTimestamp(right));

  return upcoming.find((event) => event.type === "appointment") ?? upcoming[0] ?? null;
});

const nextAppointmentTitle = computed(() => nextAppointment.value?.title ?? "No appointment scheduled");

const nextAppointmentLabel = computed(() => {
  if (!nextAppointment.value) {
    return "Open calendar";
  }

  const source = new Date(nextAppointment.value.startAt ?? `${nextAppointment.value.date}T00:00:00`);
  const today = new Date(`${todayIso}T00:00:00`);
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

const selectedDayLabel = computed(() =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${selectedDate.value}T00:00:00`)),
);

const latestCheckupDate = computed(() => {
  const checkedAt = doctorStore.currentPatient?.latestCheckup.checkedAt;
  if (!checkedAt) {
    return "No checkup recorded";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(checkedAt));
});

const latestCheckupSummary = computed(() =>
  doctorStore.currentPatient?.latestCheckup.summary || "No latest checkup summary yet.",
);

function localIsoDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const date = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${date}`;
}

function eventTimestamp(event: CalendarEvent) {
  return new Date(event.startAt ?? `${event.date}T00:00:00`).getTime();
}

const dayButtonClass = (day: { isoDate: string; isToday: boolean }) => {
  if (day.isoDate === selectedDate.value) {
    return "border border-[color:var(--theme-primary)] bg-white text-slate-900 shadow-sm";
  }
  if (day.isToday && !selectedIsToday.value) {
    return "border border-slate-200 bg-slate-100 text-slate-400 opacity-70";
  }
  return "border border-transparent text-slate-500 hover:bg-white";
};

const openCheckupEditor = () => {
  checkupForm.date = doctorStore.currentPatient?.latestCheckup.checkedAt
    ? doctorStore.currentPatient.latestCheckup.checkedAt.slice(0, 10)
    : todayIso;
  checkupForm.summary = doctorStore.currentPatient?.latestCheckup.summary ?? "";
  checkupOpen.value = true;
};

const saveCheckup = async () => {
  if (!doctorStore.currentPatient || !checkupForm.date || !checkupForm.summary.trim()) {
    return;
  }
  await doctorStore.updateLatestCheckup(doctorStore.currentPatient.id, {
    summary: checkupForm.summary.trim(),
    checkedAt: new Date(`${checkupForm.date}T00:00:00`).toISOString(),
  });
  checkupOpen.value = false;
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
