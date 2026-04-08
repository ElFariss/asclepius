<template>
  <div class="min-h-screen bg-[color:var(--surface-page)] px-4 py-6 md:px-8">
    <div class="w-full space-y-6">
      <div class="flex items-center gap-4">
        <button
          class="rounded-full border border-slate-200 bg-white p-3 text-slate-500 transition hover:text-slate-900"
          type="button"
          @click="goBack"
        >
          <ArrowLeft :size="18" />
        </button>
        <div>
          <p class="eyebrow">New patient</p>
          <h1 class="page-title text-2xl font-bold text-slate-900">Add patient</h1>
        </div>
      </div>

      <div class="grid grid-cols-5 gap-3">
        <div
          v-for="(_, index) in 5"
          :key="index"
          class="h-2.5 rounded-full"
          :class="index <= stepIndex ? 'theme-accent-bg' : 'bg-slate-200'"
        />
      </div>

      <section class="rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-200/60 md:p-8">
        <div
          v-if="currentStep === 'lookup'"
          class="w-full space-y-6"
        >
          <div>
            <p class="eyebrow">Step 1</p>
            <h2 class="page-title text-2xl font-bold text-slate-900">Find patient by ID</h2>
            <p class="mt-2 text-sm leading-7 text-slate-500">Enter the patient ID and verify the profile before continuing.</p>
          </div>

          <div class="space-y-4 rounded-[1.8rem] bg-[color:var(--surface-subtle)] p-5">
            <input
              v-model="lookupId"
              class="w-full rounded-[1.35rem] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900"
              placeholder="Patient ID (for example p1)"
              type="text"
            />
            <button
              class="theme-accent-bg w-full rounded-[1.35rem] px-4 py-4 text-sm font-semibold"
              type="button"
              @click="checkPatient"
            >
              Check patient
            </button>
          </div>

          <div
            v-if="lookupError"
            class="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700"
          >
            {{ lookupError }}
          </div>

          <div
            v-if="doctorStore.lookupResult"
            class="rounded-[1.8rem] bg-white p-5 shadow-xl shadow-slate-200/50"
          >
            <div class="flex items-center gap-4">
              <div class="h-14 w-14 overflow-hidden rounded-2xl bg-slate-100">
                <img
                  v-if="doctorStore.lookupResult.avatarUrl"
                  :src="doctorStore.lookupResult.avatarUrl"
                  alt="Patient profile"
                  class="h-full w-full object-cover"
                />
                <div
                  v-else
                  class="theme-accent-soft flex h-full w-full items-center justify-center text-lg font-bold"
                >
                  {{ doctorStore.lookupResult.name.charAt(0) }}
                </div>
              </div>
              <div>
                <p class="page-title text-xl font-bold text-slate-900">{{ doctorStore.lookupResult.name }}</p>
                <p class="text-sm text-slate-500">{{ doctorStore.lookupResult.id }} • {{ doctorStore.lookupResult.procedure }}</p>
                <p class="text-sm text-slate-400">{{ doctorStore.lookupResult.specialty }}</p>
              </div>
            </div>

            <button
              class="theme-accent-bg mt-5 w-full rounded-[1.35rem] px-4 py-4 text-sm font-semibold"
              type="button"
              @click="openConfirmation('lookup')"
            >
              Confirm patient
            </button>
          </div>
        </div>

        <div
          v-else-if="currentStep === 'surgery'"
          class="space-y-6"
        >
          <div>
            <p class="eyebrow">Step 2</p>
            <h2 class="page-title text-2xl font-bold text-slate-900">Surgery plan</h2>
            <p class="mt-2 text-sm leading-7 text-slate-500">Upload the document, preview it, and choose the surgery date with the custom calendar picker.</p>
          </div>

          <div class="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div class="space-y-5 rounded-[1.8rem] bg-[color:var(--surface-subtle)] p-6">
              <label class="block space-y-2">
                <span class="eyebrow">Upload surgery plan</span>
                <input
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  class="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white"
                  type="file"
                  @change="handleFileUpload"
                />
              </label>

              <div class="space-y-2">
                <span class="eyebrow">Confirmed operation date</span>
                <DatePickerField
                  v-model="surgeryDate"
                  placeholder="Choose surgery date"
                />
              </div>

              <button
                class="theme-accent-bg w-full rounded-[1.35rem] px-4 py-4 text-sm font-semibold"
                type="button"
                @click="openConfirmation('surgery')"
              >
                Confirm surgery plan
              </button>
            </div>

            <DocumentViewer :document="doctorStore.currentDraft.surgeryDocument" />
          </div>
        </div>

        <div
          v-else-if="currentStep === 'medicine'"
          class="space-y-6"
        >
          <div>
            <p class="eyebrow">Step 3</p>
            <h2 class="page-title text-2xl font-bold text-slate-900">Medicine plan</h2>
            <p class="mt-2 text-sm leading-7 text-slate-500">Build the medication list with dose, frequency, and before or after eating instructions.</p>
          </div>

          <div
            v-if="!doctorStore.currentDraft.medications.length"
            class="flex min-h-64 items-center justify-center rounded-[1.8rem] border border-dashed border-slate-300 bg-[color:var(--surface-subtle)]"
          >
            <button
              class="theme-accent-bg flex h-20 w-20 items-center justify-center rounded-full text-white"
              type="button"
              @click="openMedicationModal()"
            >
              <Plus :size="28" />
            </button>
          </div>

          <div
            v-else
            class="space-y-4"
          >
            <div
              v-for="medication in doctorStore.currentDraft.medications"
              :key="medication.id"
              class="rounded-[1.8rem] bg-white p-5 shadow-xl shadow-slate-200/50"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-lg font-semibold text-slate-900">{{ medication.name }}</p>
                  <p class="mt-2 text-sm leading-7 text-slate-600">{{ medication.description }}</p>
                  <p class="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    {{ medication.schedule.amount }} • {{ medication.schedule.frequency }} •
                    {{ medication.schedule.mealTiming === "before-eating" ? "Before eating" : "After eating" }}
                  </p>
                </div>
                <div class="flex gap-2">
                  <button
                    class="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700"
                    type="button"
                    @click="openMedicationModal(medication)"
                  >
                    Edit
                  </button>
                  <button
                    class="rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700"
                    type="button"
                    @click="removeMedication(medication.id)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <button
              class="theme-accent-bg mx-auto flex h-14 w-14 items-center justify-center rounded-full"
              type="button"
              @click="openMedicationModal()"
            >
              <Plus :size="24" />
            </button>
          </div>

          <button
            class="theme-accent-bg w-full rounded-[1.35rem] px-4 py-4 text-sm font-semibold"
            type="button"
            @click="openConfirmation('medicine')"
          >
            Done with medicine
          </button>
        </div>

        <div
          v-else-if="currentStep === 'diet'"
          class="space-y-6"
        >
          <div>
            <p class="eyebrow">Step 4</p>
            <h2 class="page-title text-2xl font-bold text-slate-900">Diet plan</h2>
            <p class="mt-2 text-sm leading-7 text-slate-500">Sort food guidance into mandatory, recommended, and not allowed lists.</p>
          </div>

          <div
            v-if="!sortedDiet.length"
            class="flex min-h-64 items-center justify-center rounded-[1.8rem] border border-dashed border-slate-300 bg-[color:var(--surface-subtle)]"
          >
            <button
              class="theme-accent-bg flex h-20 w-20 items-center justify-center rounded-full text-white"
              type="button"
              @click="openDietModal()"
            >
              <Plus :size="28" />
            </button>
          </div>

          <div
            v-else
            class="space-y-4"
          >
            <div
              v-for="dietItem in sortedDiet"
              :key="dietItem.id"
              class="rounded-[1.8rem] p-5 shadow-xl shadow-slate-200/30"
              :class="dietClassName(dietItem.type)"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-lg font-semibold">{{ dietItem.name }}</p>
                  <p class="mt-2 text-xs font-bold uppercase tracking-[0.18em]">{{ dietItem.type.replace('-', ' ') }}</p>
                </div>
                <div class="flex gap-2">
                  <button
                    class="rounded-full bg-white/75 px-4 py-2 text-xs font-semibold text-slate-700"
                    type="button"
                    @click="openDietModal(dietItem)"
                  >
                    Edit
                  </button>
                  <button
                    class="rounded-full bg-white/75 px-4 py-2 text-xs font-semibold text-rose-700"
                    type="button"
                    @click="removeDietItem(dietItem.id)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <button
              class="theme-accent-bg mx-auto flex h-14 w-14 items-center justify-center rounded-full"
              type="button"
              @click="openDietModal()"
            >
              <Plus :size="24" />
            </button>
          </div>

          <button
            class="theme-accent-bg w-full rounded-[1.35rem] px-4 py-4 text-sm font-semibold"
            type="button"
            @click="openConfirmation('diet')"
          >
            Done with diet
          </button>
        </div>

        <div
          v-else
          class="space-y-6"
        >
          <div>
            <p class="eyebrow">Step 5</p>
            <h2 class="page-title text-2xl font-bold text-slate-900">Patient details</h2>
            <p class="mt-2 text-sm leading-7 text-slate-500">Review the final summary before creating the pending invite.</p>
          </div>

          <div class="space-y-5 rounded-[1.8rem] bg-[color:var(--surface-subtle)] p-6">
            <div class="grid gap-5 md:grid-cols-2">
              <div>
                <p class="eyebrow">Patient</p>
                <p class="mt-2 text-lg font-semibold text-slate-900">{{ doctorStore.lookupResult?.name }}</p>
                <p class="text-sm text-slate-500">{{ doctorStore.lookupResult?.id }} • {{ doctorStore.lookupResult?.procedure }}</p>
              </div>
              <div>
                <p class="eyebrow">Surgery date</p>
                <p class="mt-2 text-lg font-semibold text-slate-900">{{ formattedSurgeryDate }}</p>
                <p class="text-sm text-slate-500">{{ doctorStore.currentDraft.surgeryDocument?.name }}</p>
              </div>
            </div>

            <div class="space-y-3">
              <p class="eyebrow">Medicine</p>
              <div
                v-for="medication in doctorStore.currentDraft.medications"
                :key="medication.id"
                class="rounded-[1.4rem] bg-white p-4"
              >
                <p class="font-semibold text-slate-900">{{ medication.name }}</p>
                <p class="mt-2 text-sm text-slate-600">{{ medication.description }}</p>
              </div>
            </div>

            <div class="space-y-3">
              <p class="eyebrow">Diet</p>
              <div
                v-for="dietItem in sortedDiet"
                :key="dietItem.id"
                class="rounded-[1.4rem] px-4 py-3"
                :class="dietClassName(dietItem.type)"
              >
                <p class="font-semibold">{{ dietItem.name }}</p>
              </div>
            </div>
          </div>

          <button
            class="theme-accent-bg w-full rounded-[1.35rem] px-4 py-4 text-sm font-semibold"
            type="button"
            @click="openConfirmation('summary')"
          >
            Create pending invite
          </button>
        </div>
      </section>
    </div>

    <ModalShell
      :description="medicineStep === 1 ? 'Start with the drug name and its description.' : 'Set the dose amount, frequency, and meal timing.'"
      :open="medicineModalOpen"
      title="Add medicine"
      @close="closeMedicineModal"
    >
      <div class="space-y-5 p-6">
        <template v-if="medicineStep === 1">
          <label class="block space-y-2">
            <span class="eyebrow">Drug name</span>
            <input
              v-model="medicineForm.name"
              class="w-full rounded-[1.35rem] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900"
              placeholder="Drug name"
              type="text"
            />
          </label>
          <label class="block space-y-2">
            <span class="eyebrow">Description</span>
            <textarea
              v-model="medicineForm.description"
              class="min-h-32 w-full rounded-[1.35rem] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900"
              placeholder="How should the patient take this drug?"
            />
          </label>
          <button
            class="theme-accent-bg w-full rounded-[1.35rem] px-4 py-4 text-sm font-semibold"
            type="button"
            @click="medicineStep = 2"
          >
            Next
          </button>
        </template>

        <template v-else>
          <div class="grid gap-4 md:grid-cols-2">
            <label class="space-y-2">
              <span class="eyebrow">Amount</span>
              <input
                v-model="medicineForm.amount"
                class="w-full rounded-[1.35rem] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900"
                placeholder="2 tablets"
                type="text"
              />
            </label>
            <label class="space-y-2">
              <span class="eyebrow">Frequency</span>
              <input
                v-model="medicineForm.frequency"
                class="w-full rounded-[1.35rem] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900"
                placeholder="every 4 days"
                type="text"
              />
            </label>
          </div>

          <div class="space-y-3">
            <p class="eyebrow">Meal timing</p>
            <label class="flex items-center gap-3 rounded-[1.35rem] border border-slate-200 px-4 py-4">
              <input
                v-model="medicineForm.mealTiming"
                type="radio"
                value="before-eating"
              />
              <span class="text-sm text-slate-700">Take before eating</span>
            </label>
            <label class="flex items-center gap-3 rounded-[1.35rem] border border-slate-200 px-4 py-4">
              <input
                v-model="medicineForm.mealTiming"
                type="radio"
                value="after-eating"
              />
              <span class="text-sm text-slate-700">Take after eating</span>
            </label>
          </div>

          <div class="flex gap-3">
            <button
              class="w-full rounded-[1.35rem] bg-slate-100 px-4 py-4 text-sm font-semibold text-slate-700"
              type="button"
              @click="medicineStep = 1"
            >
              Back
            </button>
            <button
              class="theme-accent-bg w-full rounded-[1.35rem] px-4 py-4 text-sm font-semibold"
              type="button"
              @click="saveMedicine"
            >
              Done
            </button>
          </div>
        </template>
      </div>
    </ModalShell>

    <ModalShell
      :open="dietModalOpen"
      description="Add a food and classify it as mandatory, recommended, or not allowed."
      title="Add food"
      @close="closeDietModal"
    >
      <div class="space-y-5 p-6">
        <label class="block space-y-2">
          <span class="eyebrow">Food name</span>
          <input
            v-model="dietForm.name"
            class="w-full rounded-[1.35rem] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900"
            placeholder="Food name"
            type="text"
          />
        </label>

        <div class="space-y-3">
          <p class="eyebrow">Type</p>
          <label class="flex items-center gap-3 rounded-[1.35rem] border border-slate-200 px-4 py-4">
            <input
              v-model="dietForm.type"
              type="radio"
              value="mandatory"
            />
            <span class="text-sm text-slate-700">Mandatory</span>
          </label>
          <label class="flex items-center gap-3 rounded-[1.35rem] border border-slate-200 px-4 py-4">
            <input
              v-model="dietForm.type"
              type="radio"
              value="recommended"
            />
            <span class="text-sm text-slate-700">Recommended</span>
          </label>
          <label class="flex items-center gap-3 rounded-[1.35rem] border border-slate-200 px-4 py-4">
            <input
              v-model="dietForm.type"
              type="radio"
              value="not-allowed"
            />
            <span class="text-sm text-slate-700">Not allowed</span>
          </label>
        </div>

        <button
          class="theme-accent-bg w-full rounded-[1.35rem] px-4 py-4 text-sm font-semibold"
          type="button"
          @click="saveDiet"
        >
          Done
        </button>
      </div>
    </ModalShell>

    <ConfirmationDialog
      :confirm-label="confirmLabel"
      :message="confirmMessage"
      :open="Boolean(confirmStep)"
      title="Confirm action"
      @cancel="confirmStep = null"
      @confirm="handleConfirmation"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft, Plus } from "lucide-vue-next";

import DatePickerField from "@/components/calendar/DatePickerField.vue";
import DocumentViewer from "@/components/ui/DocumentViewer.vue";
import ModalShell from "@/components/ui/ModalShell.vue";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog.vue";
import { dietClassName, sortDietItems } from "@/modules/shared/utils/carePlan";
import { useDoctorStore } from "@/stores/doctor";
import type { DietItem, MedicationPlan, SurgeryPlanDocument } from "@/types/domain";

type WizardStep = "lookup" | "surgery" | "medicine" | "diet" | "summary";
type ConfirmStep = WizardStep | null;

const doctorStore = useDoctorStore();
const router = useRouter();

const steps: WizardStep[] = ["lookup", "surgery", "medicine", "diet", "summary"];
const stepIndex = ref(0);
const lookupId = ref("");
const lookupError = ref("");
const surgeryDate = ref("");
const confirmStep = ref<ConfirmStep>(null);

const medicineModalOpen = ref(false);
const medicineStep = ref(1);
const editingMedicationId = ref("");
const medicineForm = reactive({
  name: "",
  description: "",
  amount: "",
  frequency: "",
  mealTiming: "after-eating" as MedicationPlan["schedule"]["mealTiming"],
});

const dietModalOpen = ref(false);
const editingDietId = ref("");
const dietForm = reactive({
  name: "",
  type: "mandatory" as DietItem["type"],
});

const currentStep = computed(() => steps[stepIndex.value]);
const sortedDiet = computed(() => sortDietItems(doctorStore.currentDraft.diet));
const formattedSurgeryDate = computed(() =>
  surgeryDate.value
    ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(`${surgeryDate.value}T00:00:00`))
    : "Not set",
);

const confirmMessage = computed(() => {
  switch (confirmStep.value) {
    case "lookup":
      return `Attach ${doctorStore.lookupResult?.name ?? "this patient"} to the current care plan flow?`;
    case "surgery":
      return "Does the uploaded surgery plan and selected surgery date look correct?";
    case "medicine":
      return "Is the medicine plan correct and ready for the next step?";
    case "diet":
      return "Is the diet guidance correct and ready for the summary?";
    case "summary":
      return "Create the pending invite for this patient now?";
    default:
      return "";
  }
});

const confirmLabel = computed(() => (confirmStep.value === "summary" ? "Create invite" : "Continue"));

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const goBack = () => {
  doctorStore.resetDraft();
  void router.push("/doctor/dashboard");
};

const openConfirmation = (step: WizardStep) => {
  confirmStep.value = step;
};

const handleConfirmation = async () => {
  if (!confirmStep.value) {
    return;
  }

  if (confirmStep.value === "lookup" && doctorStore.lookupResult) {
    doctorStore.setDraft({ patientId: doctorStore.lookupResult.id });
    stepIndex.value = 1;
  }

  if (confirmStep.value === "surgery" && doctorStore.currentDraft.surgeryDocument && surgeryDate.value) {
    doctorStore.setDraft({ surgeryDate: surgeryDate.value });
    stepIndex.value = 2;
  }

  if (confirmStep.value === "medicine" && doctorStore.currentDraft.medications.length) {
    stepIndex.value = 3;
  }

  if (confirmStep.value === "diet" && doctorStore.currentDraft.diet.length) {
    stepIndex.value = 4;
  }

  if (confirmStep.value === "summary") {
    await doctorStore.finalizePendingInvite();
    doctorStore.resetDraft();
    await router.push("/doctor/dashboard");
  }

  confirmStep.value = null;
};

const checkPatient = async () => {
  lookupError.value = "";
  const patient = await doctorStore.lookupPatient(lookupId.value.trim());
  if (!patient) {
    lookupError.value = "No patient matched that ID. Try one of the seeded demo IDs such as p1, p2, p3, or p4.";
  }
};

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    return;
  }

  const lowerName = file.name.toLowerCase();
  const format = lowerName.endsWith(".pdf") ? "pdf" : "docx";
  const document: SurgeryPlanDocument = {
    id: crypto.randomUUID(),
    name: file.name,
    format,
    mimeType:
      file.type ||
      (format === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
    data: await fileToDataUrl(file),
  };
  doctorStore.setDraft({ surgeryDocument: document });
};

const resetMedicineForm = () => {
  medicineForm.name = "";
  medicineForm.description = "";
  medicineForm.amount = "";
  medicineForm.frequency = "";
  medicineForm.mealTiming = "after-eating";
  medicineStep.value = 1;
  editingMedicationId.value = "";
};

const openMedicationModal = (medication?: MedicationPlan) => {
  if (medication) {
    editingMedicationId.value = medication.id;
    medicineForm.name = medication.name;
    medicineForm.description = medication.description;
    medicineForm.amount = medication.schedule.amount;
    medicineForm.frequency = medication.schedule.frequency;
    medicineForm.mealTiming = medication.schedule.mealTiming;
  } else {
    resetMedicineForm();
  }
  medicineModalOpen.value = true;
};

const closeMedicineModal = () => {
  medicineModalOpen.value = false;
  resetMedicineForm();
};

const saveMedicine = () => {
  const nextItem: MedicationPlan = {
    id: editingMedicationId.value || crypto.randomUUID(),
    name: medicineForm.name,
    description: medicineForm.description,
    schedule: {
      amount: medicineForm.amount,
      frequency: medicineForm.frequency,
      mealTiming: medicineForm.mealTiming,
      nextDoseAt: new Date(Date.now() + (doctorStore.currentDraft.medications.length + 1) * 4 * 60 * 60 * 1000).toISOString(),
    },
  };

  const existing = doctorStore.currentDraft.medications.filter((item) => item.id !== nextItem.id);
  doctorStore.setDraft({ medications: [...existing, nextItem] });
  closeMedicineModal();
};

const removeMedication = (medicationId: string) => {
  doctorStore.setDraft({
    medications: doctorStore.currentDraft.medications.filter((item) => item.id !== medicationId),
  });
};

const resetDietForm = () => {
  dietForm.name = "";
  dietForm.type = "mandatory";
  editingDietId.value = "";
};

const openDietModal = (dietItem?: DietItem) => {
  if (dietItem) {
    editingDietId.value = dietItem.id;
    dietForm.name = dietItem.name;
    dietForm.type = dietItem.type;
  } else {
    resetDietForm();
  }
  dietModalOpen.value = true;
};

const closeDietModal = () => {
  dietModalOpen.value = false;
  resetDietForm();
};

const saveDiet = () => {
  const nextItem: DietItem = {
    id: editingDietId.value || crypto.randomUUID(),
    name: dietForm.name,
    type: dietForm.type,
  };
  const existing = doctorStore.currentDraft.diet.filter((item) => item.id !== nextItem.id);
  doctorStore.setDraft({ diet: [...existing, nextItem] });
  closeDietModal();
};

const removeDietItem = (dietItemId: string) => {
  doctorStore.setDraft({
    diet: doctorStore.currentDraft.diet.filter((item) => item.id !== dietItemId),
  });
};
</script>
