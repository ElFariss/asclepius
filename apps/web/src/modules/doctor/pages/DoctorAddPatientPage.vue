<template>
  <div class="space-y-8">
    <div class="space-y-3">
      <p class="eyebrow">Add patient</p>
      <h2 class="page-title text-3xl font-bold">Create a new preparation invitation.</h2>
      <p class="muted-copy max-w-3xl text-sm leading-7">
        The workflow stays frontend-only in phase one, but the form and protocol step already mirror a backend-ready handoff shape.
      </p>
    </div>

    <section
      v-if="step === 1"
      class="space-y-5"
    >
      <div class="grid gap-4 md:grid-cols-2">
        <BaseInput
          v-model="form.name"
          label="Patient Full Name"
          placeholder="Patient Full Name"
        />
        <BaseInput
          v-model="form.medicalRecordNumber"
          label="Medical Record Number"
          placeholder="MRN"
        />
        <div class="md:col-span-2">
          <BaseInput
            v-model="form.surgeryDate"
            label="Surgery Date"
            placeholder="YYYY-MM-DD"
            type="date"
          />
        </div>
      </div>
      <BaseButton @click="goToProtocols">
        Choose Preparation Protocol
      </BaseButton>
    </section>

    <section
      v-else
      class="space-y-5"
    >
      <div class="grid gap-4 md:grid-cols-2">
        <button
          v-for="protocol in doctorStore.protocols"
          :key="protocol.id"
          class="rounded-[2rem] px-5 py-5 text-left transition"
          :class="selectedProtocolId === protocol.id ? 'surface-warm' : 'surface-elevated'"
          type="button"
          @click="selectedProtocolId = protocol.id"
        >
          <p class="text-lg font-semibold text-slate-900">{{ protocol.name }}</p>
          <p class="mt-2 text-sm text-[var(--text-muted)]">{{ protocol.category }} · {{ protocol.tasks }} tasks</p>
        </button>
      </div>
      <div class="flex flex-col gap-3 md:flex-row">
        <BaseButton
          variant="secondary"
          @click="step = 1"
        >
          Back
        </BaseButton>
        <BaseButton @click="submit">
          Send Patient Invitation
        </BaseButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import { useDoctorStore } from "@/stores/doctor";

const doctorStore = useDoctorStore();
const router = useRouter();

const step = ref(1);
const selectedProtocolId = ref("");
const form = reactive({
  name: "",
  medicalRecordNumber: "",
  surgeryDate: "",
});

const goToProtocols = async () => {
  if (!doctorStore.protocols.length) {
    await doctorStore.loadProtocols();
  }
  step.value = 2;
};

const submit = async () => {
  await doctorStore.createPatientInvitation({
    ...form,
    protocolId: selectedProtocolId.value || doctorStore.protocols[0]?.id || "",
  });
  await router.push("/doctor/dashboard");
};
</script>
