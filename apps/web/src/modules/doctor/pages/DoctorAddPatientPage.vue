<template>
  <div class="flex h-full flex-col bg-white">
    <div class="border-b border-slate-100 p-6">
      <div class="flex items-center gap-4">
        <button
          class="rounded-full p-2 transition-colors hover:bg-slate-100"
          type="button"
          @click="goBack"
        >
          <ArrowLeft :size="20" />
        </button>
        <div>
          <h2 class="page-title text-xl font-bold">Add New Patient</h2>
          <p class="mt-1 text-sm text-slate-500">Build a pending care plan that the patient will accept from their mail page.</p>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        <div
          v-for="(item, index) in steps"
          :key="item"
          class="rounded-[1.25rem] px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.18em]"
          :class="index <= stepIndex ? 'theme-accent-soft' : 'bg-slate-100 text-slate-400'"
        >
          {{ item }}
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-6">
      <div
        v-if="currentStep === 'lookup'"
        class="mx-auto max-w-2xl space-y-6"
      >
        <div class="space-y-2">
          <p class="eyebrow">Step 1</p>
          <h3 class="page-title text-2xl font-bold">Find patient by ID</h3>
          <p class="text-sm leading-7 text-slate-500">
            Enter the patient ID, check that the record matches the correct person, then confirm attaching them to your care plan workflow.
          </p>
        </div>

        <div class="space-y-4 rounded-[2rem] border border-slate-100 bg-slate-50 p-6">
          <input
            v-model="lookupId"
            class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:ring-2 focus:ring-[var(--theme-primary)]"
            placeholder="Patient ID (e.g. p1)"
          />
          <button
            class="theme-accent-bg w-full rounded-2xl py-4 text-sm font-semibold"
            type="button"
            @click="checkPatient"
          >
            Check Patient
          </button>
        </div>

        <div
          v-if="lookupError"
          class="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        >
          {{ lookupError }}
        </div>

        <div
          v-if="doctorStore.lookupResult"
          class="space-y-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm"
        >
          <p class="eyebrow">Matched patient</p>
          <div class="space-y-2">
            <p class="page-title text-2xl font-bold text-slate-900">{{ doctorStore.lookupResult.name }}</p>
            <p class="text-sm text-slate-500">{{ doctorStore.lookupResult.id }} • {{ doctorStore.lookupResult.procedure }}</p>
            <p class="text-sm text-slate-500">{{ doctorStore.lookupResult.specialty }}</p>
          </div>
          <button
            class="theme-accent-bg w-full rounded-2xl py-4 text-sm font-semibold"
            type="button"
            @click="confirmLookup"
          >
            Confirm Patient
          </button>
        </div>
      </div>

      <div
        v-else-if="currentStep === 'surgery'"
        class="mx-auto max-w-4xl space-y-6"
      >
        <div class="space-y-2">
          <p class="eyebrow">Step 2</p>
          <h3 class="page-title text-2xl font-bold">Surgery plan</h3>
          <p class="text-sm leading-7 text-slate-500">
            Upload the surgery plan in PDF or DOCX format, preview it, and confirm the operation date for this patient.
          </p>
        </div>

        <div class="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div class="space-y-5 rounded-[2rem] border border-slate-100 bg-slate-50 p-6">
            <div>
              <p class="eyebrow">Patient</p>
              <p class="mt-2 text-lg font-semibold text-slate-900">{{ doctorStore.lookupResult?.name }}</p>
              <p class="text-sm text-slate-500">{{ doctorStore.lookupResult?.procedure }}</p>
            </div>

            <label class="block space-y-2">
              <span class="eyebrow">Upload surgery plan</span>
              <input
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                class="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                type="file"
                @change="handleFileUpload"
              />
            </label>

            <label class="block space-y-2">
              <span class="eyebrow">Confirmed operation date</span>
              <input
                v-model="surgeryDate"
                class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:ring-2 focus:ring-[var(--theme-primary)]"
                type="date"
              />
            </label>

            <button
              class="theme-accent-bg w-full rounded-2xl py-4 text-sm font-semibold"
              type="button"
              @click="confirmSurgery"
            >
              Confirm Surgery Plan
            </button>
          </div>

          <DocumentViewer :document="doctorStore.currentDraft.surgeryDocument" />
        </div>
      </div>

      <div
        v-else-if="currentStep === 'medicine'"
        class="mx-auto max-w-4xl space-y-6"
      >
        <div class="space-y-2">
          <p class="eyebrow">Step 3</p>
          <h3 class="page-title text-2xl font-bold">Medicine plan</h3>
          <p class="text-sm leading-7 text-slate-500">
            Add each drug with its description, dose, frequency, and whether it should be taken before or after eating.
          </p>
        </div>

        <div
          v-if="!doctorStore.currentDraft.medications.length"
          class="flex min-h-64 items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-slate-50"
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
            class="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p class="text-lg font-semibold text-slate-900">{{ medication.name }}</p>
                <p class="mt-2 text-sm leading-7 text-slate-500">{{ medication.description }}</p>
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
          class="theme-accent-bg w-full rounded-2xl py-4 text-sm font-semibold"
          type="button"
          @click="confirmMedicines"
        >
          Done With Medicine
        </button>
      </div>

      <div
        v-else-if="currentStep === 'diet'"
        class="mx-auto max-w-4xl space-y-6"
      >
        <div class="space-y-2">
          <p class="eyebrow">Step 4</p>
          <h3 class="page-title text-2xl font-bold">Diet plan</h3>
          <p class="text-sm leading-7 text-slate-500">
            Add foods, mark whether they are mandatory, recommended, or not allowed, and confirm the full diet plan.
          </p>
        </div>

        <div
          v-if="!sortedDiet.length"
          class="flex min-h-64 items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-slate-50"
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
            class="rounded-[2rem] p-5"
            :class="dietClassName(dietItem.type)"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-lg font-semibold">{{ dietItem.name }}</p>
                <p class="mt-2 text-xs font-bold uppercase tracking-[0.18em]">
                  {{ dietItem.type.replace('-', ' ') }}
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  class="rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700"
                  type="button"
                  @click="openDietModal(dietItem)"
                >
                  Edit
                </button>
                <button
                  class="rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-rose-700"
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
          class="theme-accent-bg w-full rounded-2xl py-4 text-sm font-semibold"
          type="button"
          @click="confirmDiet"
        >
          Done With Diet
        </button>
      </div>

      <div
        v-else
        class="mx-auto max-w-4xl space-y-6"
      >
        <div class="space-y-2">
          <p class="eyebrow">Step 5</p>
          <h3 class="page-title text-2xl font-bold">Patient details</h3>
          <p class="text-sm leading-7 text-slate-500">
            Review the full care plan, then confirm the pending invite. The patient will receive it on their mail page and it will stay yellow until accepted.
          </p>
        </div>

        <div class="space-y-5 rounded-[2rem] border border-slate-100 bg-slate-50 p-6">
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
              class="rounded-[1.5rem] bg-white p-4"
            >
              <p class="font-semibold text-slate-900">{{ medication.name }}</p>
              <p class="mt-1 text-sm leading-7 text-slate-500">{{ medication.description }}</p>
              <p class="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                {{ medication.schedule.amount }} • {{ medication.schedule.frequency }} •
                {{ medication.schedule.mealTiming === "before-eating" ? "Before eating" : "After eating" }}
              </p>
            </div>
          </div>

          <div class="space-y-3">
            <p class="eyebrow">Diet</p>
            <div
              v-for="dietItem in sortedDiet"
              :key="dietItem.id"
              class="rounded-[1.5rem] px-4 py-3"
              :class="dietClassName(dietItem.type)"
            >
              <p class="font-semibold">{{ dietItem.name }}</p>
              <p class="mt-1 text-xs font-bold uppercase tracking-[0.18em]">{{ dietItem.type.replace('-', ' ') }}</p>
            </div>
          </div>
        </div>

        <button
          class="theme-accent-bg w-full rounded-2xl py-4 text-sm font-semibold"
          type="button"
          @click="finalizeInvite"
        >
          Create Pending Invite
        </button>
      </div>
    </div>

    <ModalShell
      :description="medicineStep === 1 ? 'Start with the drug name and basic instructions.' : 'Set the dose and meal timing for this drug.'"
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
              class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none transition focus:ring-2 focus:ring-[var(--theme-primary)]"
              placeholder="Drug name"
            />
          </label>
          <label class="block space-y-2">
            <span class="eyebrow">Description</span>
            <textarea
              v-model="medicineForm.description"
              class="min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none transition focus:ring-2 focus:ring-[var(--theme-primary)]"
              placeholder="Describe how the patient should take this drug"
            />
          </label>
          <button
            class="theme-accent-bg w-full rounded-2xl py-4 text-sm font-semibold"
            type="button"
            @click="medicineStep = 2"
          >
            Next
          </button>
        </template>

        <template v-else>
          <div class="grid gap-4 md:grid-cols-2">
            <label class="block space-y-2">
              <span class="eyebrow">Amount</span>
              <input
                v-model="medicineForm.amount"
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none transition focus:ring-2 focus:ring-[var(--theme-primary)]"
                placeholder="e.g. 2 tablets"
              />
            </label>
            <label class="block space-y-2">
              <span class="eyebrow">Frequency</span>
              <input
                v-model="medicineForm.frequency"
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none transition focus:ring-2 focus:ring-[var(--theme-primary)]"
                placeholder="e.g. every 4 days"
              />
            </label>
          </div>

          <div class="space-y-3">
            <p class="eyebrow">Meal timing</p>
            <label class="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
              <input
                v-model="medicineForm.mealTiming"
                type="radio"
                value="before-eating"
              />
              <span class="text-sm text-slate-700">Take before eating</span>
            </label>
            <label class="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
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
              class="w-full rounded-2xl bg-slate-100 py-4 text-sm font-semibold text-slate-700"
              type="button"
              @click="medicineStep = 1"
            >
              Back
            </button>
            <button
              class="theme-accent-bg w-full rounded-2xl py-4 text-sm font-semibold"
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
      description="Add a food item and classify whether it is mandatory, recommended, or not allowed."
      title="Add food"
      @close="closeDietModal"
    >
      <div class="space-y-5 p-6">
        <label class="block space-y-2">
          <span class="eyebrow">Food name</span>
          <input
            v-model="dietForm.name"
            class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none transition focus:ring-2 focus:ring-[var(--theme-primary)]"
            placeholder="Food name"
          />
        </label>

        <div class="space-y-3">
          <p class="eyebrow">Type</p>
          <label class="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
            <input
              v-model="dietForm.type"
              type="radio"
              value="mandatory"
            />
            <span class="text-sm text-slate-700">Mandatory</span>
          </label>
          <label class="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
            <input
              v-model="dietForm.type"
              type="radio"
              value="recommended"
            />
            <span class="text-sm text-slate-700">Recommended</span>
          </label>
          <label class="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
            <input
              v-model="dietForm.type"
              type="radio"
              value="not-allowed"
            />
            <span class="text-sm text-slate-700">Not allowed</span>
          </label>
        </div>

        <button
          class="theme-accent-bg w-full rounded-2xl py-4 text-sm font-semibold"
          type="button"
          @click="saveDiet"
        >
          Done
        </button>
      </div>
    </ModalShell>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft, Plus } from "lucide-vue-next";

import DocumentViewer from "@/components/ui/DocumentViewer.vue";
import ModalShell from "@/components/ui/ModalShell.vue";
import { dietClassName, sortDietItems } from "@/modules/shared/utils/carePlan";
import { useDoctorStore } from "@/stores/doctor";
import type { DietItem, MedicationPlan, SurgeryPlanDocument } from "@/types/domain";

type WizardStep = "lookup" | "surgery" | "medicine" | "diet" | "summary";

const doctorStore = useDoctorStore();
const router = useRouter();

const steps: WizardStep[] = ["lookup", "surgery", "medicine", "diet", "summary"];
const stepIndex = ref(0);
const lookupId = ref("");
const lookupError = ref("");
const surgeryDate = ref("");

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
    ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(`${surgeryDate.value}T08:00:00.000Z`))
    : "Not set",
);

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

const checkPatient = async () => {
  lookupError.value = "";
  const patient = await doctorStore.lookupPatient(lookupId.value.trim());
  if (!patient) {
    lookupError.value = "No patient matched that ID. Try one of the seeded demo IDs such as p1, p2, p3, or p4.";
  }
};

const confirmLookup = async () => {
  if (!doctorStore.lookupResult) {
    return;
  }

  if (!window.confirm(`Add ${doctorStore.lookupResult.name} to this new care plan flow?`)) {
    return;
  }

  doctorStore.setDraft({ patientId: doctorStore.lookupResult.id });
  await doctorStore.saveDraft();
  stepIndex.value = 1;
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

const confirmSurgery = async () => {
  if (!doctorStore.currentDraft.surgeryDocument || !surgeryDate.value) {
    return;
  }

  if (!window.confirm("Does the uploaded surgery plan and confirmed operation date look correct?")) {
    return;
  }

  doctorStore.setDraft({ surgeryDate: surgeryDate.value });
  await doctorStore.saveDraft();
  stepIndex.value = 2;
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

const confirmMedicines = async () => {
  if (!doctorStore.currentDraft.medications.length) {
    return;
  }

  if (!window.confirm("Is the medicine list correct?")) {
    return;
  }

  await doctorStore.saveDraft();
  stepIndex.value = 3;
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

const confirmDiet = async () => {
  if (!doctorStore.currentDraft.diet.length) {
    return;
  }

  if (!window.confirm("Is the diet list correct?")) {
    return;
  }

  await doctorStore.saveDraft();
  stepIndex.value = 4;
};

const finalizeInvite = async () => {
  if (!window.confirm("Create this pending invite for the patient?")) {
    return;
  }

  await doctorStore.finalizePendingInvite();
  doctorStore.resetDraft();
  await router.push("/doctor/dashboard");
};
</script>
