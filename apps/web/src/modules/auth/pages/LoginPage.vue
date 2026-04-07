<template>
  <div class="flex h-full flex-col gap-8">
    <div class="space-y-5">
      <AuthRoleTabs />
      <div class="space-y-3">
        <p class="eyebrow">{{ currentRole === 'doctor' ? 'Doctor access' : 'Patient access' }}</p>
        <h2 class="page-title text-4xl font-bold text-slate-950">
          {{ currentRole === "doctor" ? "Review readiness across your patient list." : "Stay aligned with your surgery plan." }}
        </h2>
        <p class="muted-copy max-w-xl text-sm leading-7">
          {{ currentRole === "doctor" ? "Access patient status, monitor compliance, and decide faster on readiness." : "Check your invitation, understand the procedure, and complete your daily preparation with confidence." }}
        </p>
      </div>
    </div>

    <form
      class="space-y-4"
      @submit.prevent="handleSubmit"
    >
      <BaseInput
        v-model="form.email"
        label="Email Address"
        placeholder="name@example.com"
        type="email"
      />
      <BaseInput
        v-model="form.password"
        label="Password"
        placeholder="••••••••"
        type="password"
      />
      <BaseButton type="submit">
        {{ currentRole === "doctor" ? "Open Doctor Dashboard" : "Continue to Preparation" }}
      </BaseButton>
    </form>

    <div class="surface-soft rounded-[2rem] p-5">
      <p class="text-sm text-slate-700">
        {{ currentRole === "doctor" ? "Need an account for a new clinician?" : "First time here?" }}
        <RouterLink
          class="ml-1 font-semibold text-[var(--brand-blue)]"
          :to="`/${currentRole}/register`"
        >
          Create one now
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

import AuthRoleTabs from "@/modules/auth/components/AuthRoleTabs.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import { useSessionStore } from "@/stores/session";
import type { UserRole } from "@/types/domain";

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();

const currentRole = computed<UserRole>(() => (route.meta.role as UserRole) ?? "patient");

const form = reactive({
  email: currentRole.value === "doctor" ? "dr.andi@hospital.com" : "patient@example.com",
  password: "password123",
});

const handleSubmit = async () => {
  await sessionStore.login(currentRole.value, form);
  await router.push(sessionStore.defaultHomeRoute);
};
</script>
