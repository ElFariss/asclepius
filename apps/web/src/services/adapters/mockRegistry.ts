import {
  activeCarePlansFixture,
  patientLookupFixture,
  progressByPatientIdFixture,
  tasksByPatientIdFixture,
} from "@/services/fixtures/data";
import type {
  CalendarEvent,
  CalendarMonthDetails,
  CarePlanDraft,
  DietItem,
  DoctorDashboardData,
  DoctorPatientSummary,
  MedicationPlan,
  Patient,
  PatientCarePlan,
  PatientDetail,
  PatientInvite,
  PatientLookupRecord,
  PatientTask,
  ProgressPoint,
  SleepSummary,
} from "@/types/domain";

export interface RegistryState {
  patients: PatientLookupRecord[];
  activePlans: Record<string, PatientCarePlan>;
  pendingPlans: Record<string, PatientCarePlan>;
  tasksByPatientId: Record<string, PatientTask[]>;
  progressByPatientId: Record<string, ProgressPoint[]>;
  draftsByPatientId: Record<string, CarePlanDraft>;
}

const STORAGE_KEY = "asclepius-mock-registry";

const DIET_ORDER: Record<DietItem["type"], number> = {
  mandatory: 0,
  recommended: 1,
  "not-allowed": 2,
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const parseDate = (value: string) => new Date(value.includes("T") ? value : `${value}T08:00:00.000Z`);

const formatLongDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parseDate(value));

const createCalendarEvents = (
  patient: PatientLookupRecord,
  plan: Pick<PatientCarePlan, "surgeryDate" | "medications">,
): CalendarEvent[] => {
  const events: CalendarEvent[] = [
    {
      id: `${patient.id}-surgery`,
      date: plan.surgeryDate,
      type: "surgery",
      title: patient.procedure,
      detail: `Confirmed surgery with ${patient.doctorName}.`,
    },
  ];

  const appointmentDate = new Date(parseDate(plan.surgeryDate));
  appointmentDate.setDate(appointmentDate.getDate() - 1);
  events.push({
    id: `${patient.id}-appointment`,
    date: appointmentDate.toISOString().slice(0, 10),
    type: "appointment",
    title: "Pre-op consultation",
    detail: patient.nextAppointment,
  });

  plan.medications.forEach((medication, index) => {
    const startDate = new Date(medication.schedule.nextDoseAt);
    const match = medication.schedule.frequency.match(/(\d+)/);
    const intervalDays = match ? Number(match[1]) : 1;

    for (let occurrence = 0; occurrence < 3; occurrence += 1) {
      const nextDate = new Date(startDate);
      nextDate.setDate(nextDate.getDate() + occurrence * intervalDays);
      events.push({
        id: `${medication.id}-${index}-${occurrence}`,
        date: nextDate.toISOString().slice(0, 10),
        type: "medication",
        title: `Take ${medication.name}`,
        detail: `${medication.schedule.amount} • ${medication.schedule.frequency} • ${
          medication.schedule.mealTiming === "before-eating" ? "Before eating" : "After eating"
        }`,
      });
    }
  });

  return events.sort((left, right) => left.date.localeCompare(right.date));
};

const withCalendar = (
  patient: PatientLookupRecord,
  plan: PatientCarePlan,
): PatientCarePlan => ({
  ...plan,
  diet: [...plan.diet].sort((left, right) => DIET_ORDER[left.type] - DIET_ORDER[right.type]),
  calendarEvents: createCalendarEvents(patient, plan),
});

const fallbackPlanFor = (patient: PatientLookupRecord): PatientCarePlan =>
  withCalendar(patient, {
    inviteId: `invite-${patient.id}-placeholder`,
    patientId: patient.id,
    procedure: patient.procedure,
    surgeryDate: "2026-04-30",
    surgeryDocument: null,
    medications: [],
    diet: [],
    calendarEvents: [],
    sleepEntries: clone(activeCarePlansFixture.p1.sleepEntries),
    inviteStatus: "active",
    createdAt: new Date("2026-04-01T08:00:00.000Z").toISOString(),
    acceptedAt: null,
  });

const createInitialRegistry = (): RegistryState => {
  const activePlans = Object.fromEntries(
    Object.entries(activeCarePlansFixture).map(([patientId, plan]) => {
      const patient = patientLookupFixture.find((item) => item.id === patientId)!;
      return [patientId, withCalendar(patient, clone(plan))];
    }),
  );

  return {
    patients: clone(patientLookupFixture),
    activePlans,
    pendingPlans: {},
    tasksByPatientId: clone(tasksByPatientIdFixture),
    progressByPatientId: clone(progressByPatientIdFixture),
    draftsByPatientId: {},
  };
};

const readState = (): RegistryState => {
  if (typeof window === "undefined") {
    return createInitialRegistry();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const nextState = createInitialRegistry();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    return nextState;
  }

  return JSON.parse(raw) as RegistryState;
};

const writeState = (state: RegistryState) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const getPatientRecord = (state: RegistryState, patientId: string) =>
  state.patients.find((patient) => patient.id === patientId);

const getEffectivePlan = (state: RegistryState, patientId: string) =>
  state.pendingPlans[patientId] ?? state.activePlans[patientId];

const getStatusLabel = (inviteStatus: PatientCarePlan["inviteStatus"], baseStatus: string) =>
  inviteStatus === "pending-acceptance" ? "Pending Acceptance" : baseStatus;

const toSummary = (
  patient: PatientLookupRecord,
  plan: PatientCarePlan,
): DoctorPatientSummary => ({
  id: patient.id,
  name: patient.name,
  procedure: plan.procedure,
  compliance: patient.compliance,
  risk: patient.risk,
  riskScore: patient.riskScore,
  status: getStatusLabel(plan.inviteStatus, patient.risk === "High" ? "Needs Intervention" : patient.risk === "Medium" ? "Warning" : "On Track"),
  inviteStatus: plan.inviteStatus,
});

export const registry = {
  reset() {
    const nextState = createInitialRegistry();
    writeState(nextState);
    return nextState;
  },
  read: readState,
  write: writeState,
  findPatientByEmail(email: string) {
    const state = readState();
    return state.patients.find((patient) => patient.email.toLowerCase() === email.toLowerCase()) ?? state.patients[0];
  },
  lookupPatientById(patientId: string) {
    const state = readState();
    return getPatientRecord(state, patientId) ?? null;
  },
  saveDraft(draft: CarePlanDraft) {
    const state = readState();
    state.draftsByPatientId[draft.patientId] = clone(draft);
    writeState(state);
    return draft;
  },
  finalizePendingInvite(draft: CarePlanDraft) {
    const state = readState();
    const patient = getPatientRecord(state, draft.patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }

    const nextPlan = withCalendar(patient, {
      inviteId: `invite-${draft.patientId}-${Date.now()}`,
      patientId: draft.patientId,
      procedure: patient.procedure,
      surgeryDate: draft.surgeryDate,
      surgeryDocument: draft.surgeryDocument,
      medications: draft.medications,
      diet: draft.diet,
      calendarEvents: [],
      sleepEntries: state.activePlans[draft.patientId]?.sleepEntries ?? activeCarePlansFixture.p1.sleepEntries,
      inviteStatus: "pending-acceptance",
      createdAt: new Date().toISOString(),
      acceptedAt: null,
    });

    state.pendingPlans[draft.patientId] = nextPlan;
    delete state.draftsByPatientId[draft.patientId];
    writeState(state);
    return { inviteId: nextPlan.inviteId, patientId: draft.patientId };
  },
  acceptInvite(patientId: string) {
    const state = readState();
    const pending = state.pendingPlans[patientId];
    if (!pending) {
      return null;
    }

    state.activePlans[patientId] = {
      ...pending,
      inviteStatus: "active",
      acceptedAt: new Date().toISOString(),
    };
    delete state.pendingPlans[patientId];
    writeState(state);
    return state.activePlans[patientId];
  },
  getPatientInvite(patientId: string): PatientInvite {
    const state = readState();
    const patient = getPatientRecord(state, patientId) ?? state.patients[0];
    const pending = state.pendingPlans[patient.id];
    const active = state.activePlans[patient.id];
    const plan = pending ?? active ?? fallbackPlanFor(patient);

    return {
      inviteId: plan.inviteId,
      patientId: patient.id,
      status: plan.inviteStatus,
      doctorName: patient.doctorName,
      specialty: patient.specialty,
      procedure: plan.procedure,
      surgeryDate: formatLongDate(plan.surgeryDate),
      hasPendingUpdate: Boolean(pending),
    };
  },
  getPatientProfile(patientId: string): Patient {
    const state = readState();
    const patient = getPatientRecord(state, patientId) ?? state.patients[0];
    const plan = getEffectivePlan(state, patient.id) ?? fallbackPlanFor(patient);
    return {
      id: patient.id,
      name: patient.name,
      procedure: plan.procedure,
      compliance: patient.compliance,
      risk: patient.risk,
      riskScore: patient.riskScore,
      status: getStatusLabel(plan.inviteStatus, patient.risk === "High" ? "Needs Intervention" : patient.risk === "Medium" ? "Warning" : "On Track"),
      inviteStatus: plan.inviteStatus,
      surgeryDate: formatLongDate(plan.surgeryDate),
      daysUntilSurgery: patient.daysUntilSurgery,
      attendingDoctor: patient.doctorName,
      specialty: patient.specialty,
      hospitalStay: patient.hospitalStay,
      surgeryDuration: patient.surgeryDuration,
      nextAppointment: patient.nextAppointment,
    };
  },
  getPatientTasks(patientId: string) {
    const state = readState();
    return clone(state.tasksByPatientId[patientId] ?? state.tasksByPatientId.p1);
  },
  updateTask(patientId: string, taskId: string, completed: boolean) {
    const state = readState();
    const tasks = state.tasksByPatientId[patientId] ?? state.tasksByPatientId.p1;
    state.tasksByPatientId[patientId] = tasks.map((task) => (task.id === taskId ? { ...task, completed } : task));
    writeState(state);
    return clone(state.tasksByPatientId[patientId]);
  },
  getProgress(patientId: string) {
    const state = readState();
    return clone(state.progressByPatientId[patientId] ?? state.progressByPatientId.p1);
  },
  getDoctorDashboard(): DoctorDashboardData {
    const state = readState();
    const patients = state.patients
      .filter((patient) => state.activePlans[patient.id] || state.pendingPlans[patient.id])
      .map((patient) => toSummary(patient, getEffectivePlan(state, patient.id)!));

    return {
      doctorName: "Andi Setiawan",
      title: "General Surgery",
      activePatients: patients.filter((patient) => patient.inviteStatus === "active").length,
      needsIntervention: patients.filter((patient) => patient.inviteStatus === "active" && patient.risk === "High").length,
      patients,
    };
  },
  getPatientDetail(patientId: string): PatientDetail {
    const state = readState();
    const patient = getPatientRecord(state, patientId) ?? state.patients[0];
    const plan = getEffectivePlan(state, patient.id) ?? fallbackPlanFor(patient);
    return {
      ...toSummary(patient, plan),
      nextAppointment: patient.nextAppointment,
      tasks: clone(state.tasksByPatientId[patient.id] ?? state.tasksByPatientId.p1),
      notes: patient.notes,
      surgeryDate: formatLongDate(plan.surgeryDate),
      surgeryDocument: plan.surgeryDocument,
      medications: clone(plan.medications),
      diet: clone(plan.diet),
      calendarEvents: clone(plan.calendarEvents),
    };
  },
  getMedicationPlan(patientId: string) {
    const state = readState();
    const patient = getPatientRecord(state, patientId) ?? state.patients[0];
    const plan = getEffectivePlan(state, patient.id) ?? fallbackPlanFor(patient);
    return clone(plan.medications);
  },
  getDietPlan(patientId: string) {
    const state = readState();
    const patient = getPatientRecord(state, patientId) ?? state.patients[0];
    const plan = getEffectivePlan(state, patient.id) ?? fallbackPlanFor(patient);
    return clone(plan.diet).sort((left, right) => DIET_ORDER[left.type] - DIET_ORDER[right.type]);
  },
  getCalendarEvents(patientId: string): CalendarMonthDetails {
    const state = readState();
    const patient = getPatientRecord(state, patientId) ?? state.patients[0];
    const plan = getEffectivePlan(state, patient.id) ?? fallbackPlanFor(patient);
    return {
      monthLabel: "April 2026",
      events: clone(plan.calendarEvents),
    };
  },
  getSleepSummary(patientId: string): SleepSummary {
    const state = readState();
    const patient = getPatientRecord(state, patientId) ?? state.patients[0];
    const plan = getEffectivePlan(state, patient.id) ?? fallbackPlanFor(patient);
    const averageHours =
      plan.sleepEntries.reduce((sum, entry) => sum + entry.hours, 0) / Math.max(plan.sleepEntries.length, 1);
    return {
      targetHours: 7,
      averageHours,
      meetsTarget: averageHours >= 7,
      entries: clone(plan.sleepEntries),
    };
  },
};
