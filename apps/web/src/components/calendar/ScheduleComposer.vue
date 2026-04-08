<template>
  <ModalShell
    :description="`Schedule a ${modeLabel.toLowerCase()} for this patient.`"
    :open="open"
    :title="`Add ${modeLabel}`"
    @close="closeComposer"
  >
    <div class="space-y-5 p-6">
      <div
        v-if="mode === 'medication'"
        class="space-y-2"
      >
        <p class="eyebrow">Medicine</p>
        <select
          v-model="form.medicationId"
          class="theme-input"
        >
          <option
            disabled
            value=""
          >
            Choose medicine
          </option>
          <option
            v-for="item in medications"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </option>
        </select>
      </div>

      <label class="block space-y-2">
        <span class="eyebrow">Title</span>
        <input
          v-model="form.title"
          class="theme-input"
          placeholder="Event title"
          type="text"
        />
      </label>

      <label class="block space-y-2">
        <span class="eyebrow">Details</span>
        <textarea
          v-model="form.detail"
          class="min-h-24 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-[13px] text-slate-900"
          placeholder="Notes for the patient"
        />
      </label>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <span class="eyebrow">Date</span>
          <DatePickerField
            v-model="form.date"
            placeholder="Choose date"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <label class="space-y-2">
            <span class="eyebrow">Start</span>
            <input
              v-model="form.startTime"
              class="theme-input"
              type="time"
            />
          </label>
          <label class="space-y-2">
            <span class="eyebrow">End</span>
            <input
              v-model="form.endTime"
              class="theme-input"
              type="time"
            />
          </label>
        </div>
      </div>

      <div class="space-y-3">
        <p class="eyebrow">Frequency</p>
        <div class="grid gap-3 md:grid-cols-2">
          <button
            v-for="option in frequencyOptions"
            :key="option.value"
            class="rounded-xl border px-4 py-3.5 text-left text-[13px] font-medium transition"
            :class="form.frequencyMode === option.value ? 'border-[var(--theme-primary)] theme-accent-soft' : 'border-slate-200 bg-white text-slate-600'"
            type="button"
            @click="handleFrequency(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <div class="flex gap-3">
        <button
          class="w-full rounded-xl bg-slate-100 px-4 py-3.5 text-[13px] font-semibold text-slate-700"
          type="button"
          @click="closeComposer"
        >
          Cancel
        </button>
        <button
          class="theme-accent-bg w-full rounded-xl px-4 py-3.5 text-[13px] font-semibold"
          type="button"
          @click="submit"
        >
          Save
        </button>
      </div>
    </div>
  </ModalShell>

  <ModalShell
    :open="customOpen"
    description="Define the repeat interval, optional weekday/month pattern, and how the schedule ends."
    title="Custom frequency"
    @close="customOpen = false"
  >
    <div class="space-y-5 p-6">
      <div class="grid grid-cols-[120px_1fr] gap-3">
        <label class="space-y-2">
          <span class="eyebrow">Repeat every</span>
          <input
            v-model.number="custom.interval"
            class="theme-input"
            min="1"
            type="number"
          />
        </label>
        <label class="space-y-2">
          <span class="eyebrow">Unit</span>
          <select
            v-model="custom.unit"
            class="theme-input"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </label>
      </div>

      <div
        v-if="custom.unit === 'week'"
        class="space-y-3"
      >
        <p class="eyebrow">Repeat on</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="day in weekdays"
            :key="day.value"
            class="h-10 w-10 rounded-full border text-xs font-semibold"
            :class="custom.weekdays.includes(day.value) ? 'theme-accent-bg border-transparent' : 'border-slate-200 bg-white text-slate-600'"
            type="button"
            @click="toggleWeekday(day.value)"
          >
            {{ day.label }}
          </button>
        </div>
      </div>

      <div
        v-if="custom.unit === 'month'"
        class="space-y-3"
      >
        <p class="eyebrow">Monthly pattern</p>
        <div class="grid gap-3">
          <label class="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3.5">
            <input
              v-model="custom.monthlyPattern"
              type="radio"
              value="day-of-month"
            />
            <span class="text-sm text-slate-700">Monthly on day {{ monthDay }}</span>
          </label>
          <label class="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3.5">
            <input
              v-model="custom.monthlyPattern"
              type="radio"
              value="first-weekday"
            />
            <span class="text-sm text-slate-700">Monthly on the first {{ weekdayLabel }}</span>
          </label>
        </div>
      </div>

      <div class="space-y-3">
        <p class="eyebrow">Ends</p>
        <div class="grid gap-3">
          <label class="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3.5">
            <input
              v-model="custom.endType"
              type="radio"
              value="never"
            />
            <span class="text-sm text-slate-700">Never</span>
          </label>
          <label class="space-y-3 rounded-xl border border-slate-200 px-4 py-3.5">
            <div class="flex items-center gap-3">
              <input
                v-model="custom.endType"
                type="radio"
                value="on-date"
              />
              <span class="text-sm text-slate-700">On date</span>
            </div>
            <DatePickerField
              v-if="custom.endType === 'on-date'"
              v-model="custom.endDate"
              placeholder="Choose ending date"
            />
          </label>
          <label class="space-y-3 rounded-xl border border-slate-200 px-4 py-3.5">
            <div class="flex items-center gap-3">
              <input
                v-model="custom.endType"
                type="radio"
                value="after-occurrences"
              />
              <span class="text-sm text-slate-700">After occurrences</span>
            </div>
            <input
              v-if="custom.endType === 'after-occurrences'"
              v-model.number="custom.occurrences"
              class="theme-input"
              min="1"
              type="number"
            />
          </label>
        </div>
      </div>

      <button
        class="theme-accent-bg w-full rounded-xl px-4 py-3.5 text-[13px] font-semibold"
        type="button"
        @click="applyCustom"
      >
        Done
      </button>
    </div>
  </ModalShell>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from "vue";

import DatePickerField from "@/components/calendar/DatePickerField.vue";
import ModalShell from "@/components/ui/ModalShell.vue";
import type { CalendarEventCreatePayload, MedicationPlan, RecurrenceRule } from "@/types/domain";

const props = withDefaults(
  defineProps<{
    open: boolean;
    mode: "appointment" | "task" | "medication";
    medications?: MedicationPlan[];
  }>(),
  {
    medications: () => [],
  },
);

const emit = defineEmits<{
  (event: "close"): void;
  (event: "save", value: CalendarEventCreatePayload): void;
}>();

const form = reactive({
  medicationId: "",
  title: "",
  detail: "",
  date: "",
  startTime: "09:00",
  endTime: "10:00",
  frequencyMode: "does-not-repeat" as RecurrenceRule["mode"],
});

const custom = reactive({
  interval: 1,
  unit: "day" as RecurrenceRule["unit"],
  weekdays: [] as string[],
  monthlyPattern: "day-of-month" as NonNullable<RecurrenceRule["monthlyPattern"]>,
  endType: "never" as RecurrenceRule["end"]["type"],
  endDate: "",
  occurrences: 4,
});

const customOpen = defineModel<boolean>("customOpen", { default: false });

watch(
  () => props.open,
  (value) => {
    if (!value) {
      return;
    }
    form.medicationId = "";
    form.title = "";
    form.detail = "";
    form.date = "";
    form.startTime = "09:00";
    form.endTime = "10:00";
    form.frequencyMode = "does-not-repeat";
    custom.interval = 1;
    custom.unit = "day";
    custom.weekdays = [];
    custom.monthlyPattern = "day-of-month";
    custom.endType = "never";
    custom.endDate = "";
    custom.occurrences = 4;
  },
);

watch(
  () => form.medicationId,
  (value) => {
    if (props.mode !== "medication") {
      return;
    }
    const medication = props.medications.find((item) => item.id === value);
    if (!medication) {
      return;
    }
    form.title = `Take ${medication.name}`;
    form.detail = medication.description;
  },
);

const modeLabel = computed(() =>
  props.mode === "appointment" ? "Appointment" : props.mode === "task" ? "Task" : "Medicine",
);

const monthDay = computed(() => (form.date ? new Date(`${form.date}T00:00:00`).getDate() : 1));
const weekdayLabel = computed(() =>
  form.date
    ? new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date(`${form.date}T00:00:00`)).toLowerCase()
    : "monday",
);

const weekdays = [
  { label: "S", value: "sunday" },
  { label: "M", value: "monday" },
  { label: "T", value: "tuesday" },
  { label: "W", value: "wednesday" },
  { label: "T", value: "thursday" },
  { label: "F", value: "friday" },
  { label: "S", value: "saturday" },
];

const frequencyOptions = [
  { label: "Does not repeat", value: "does-not-repeat" as const },
  { label: "Every week", value: "every-week" as const },
  { label: "Every month", value: "every-month" as const },
  { label: "Custom", value: "custom" as const },
];

const handleFrequency = (value: RecurrenceRule["mode"]) => {
  form.frequencyMode = value;
  if (value === "custom") {
    customOpen.value = true;
  }
};

const toggleWeekday = (value: string) => {
  custom.weekdays = custom.weekdays.includes(value)
    ? custom.weekdays.filter((item) => item !== value)
    : [...custom.weekdays, value];
};

const buildRecurrence = (): RecurrenceRule | null => {
  if (form.frequencyMode === "does-not-repeat") {
    return null;
  }

  if (form.frequencyMode === "every-week") {
    return {
      mode: "every-week",
      interval: 1,
      unit: "week",
      weekdays: [weekdayLabel.value],
      end: { type: "never" },
    };
  }

  if (form.frequencyMode === "every-month") {
    return {
      mode: "every-month",
      interval: 1,
      unit: "month",
      monthlyPattern: "day-of-month",
      end: { type: "never" },
    };
  }

  return {
    mode: "custom",
    interval: custom.interval,
    unit: custom.unit,
    weekdays: custom.unit === "week" ? custom.weekdays : undefined,
    monthlyPattern: custom.unit === "month" ? custom.monthlyPattern : undefined,
    end:
      custom.endType === "never"
        ? { type: "never" }
        : custom.endType === "on-date"
          ? { type: "on-date", endDate: custom.endDate }
          : { type: "after-occurrences", occurrences: custom.occurrences },
  };
};

const closeComposer = () => {
  emit("close");
};

const applyCustom = () => {
  customOpen.value = false;
};

const submit = () => {
  if (!form.title || !form.date || !form.startTime) {
    return;
  }

  const startAt = new Date(`${form.date}T${form.startTime}:00`);
  const endAt = new Date(`${form.date}T${form.endTime || form.startTime}:00`);

  emit("save", {
    type: props.mode,
    title: form.title,
    detail: form.detail,
    startAt: startAt.toISOString(),
    endAt: endAt.toISOString(),
    allDay: false,
    medicationId: props.mode === "medication" ? form.medicationId : undefined,
    recurrence: buildRecurrence(),
  });
};
</script>
