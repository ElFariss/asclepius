<template>
  <div class="flex h-full flex-col gap-8">
    <div class="space-y-5">
      <AuthRoleTabs />
      <div class="space-y-3">
        <p class="eyebrow">Create account</p>
        <h2 class="page-title text-4xl font-bold text-slate-950">
          Join Asclepius as a {{ currentRole }}.
        </h2>
        <p class="muted-copy max-w-xl text-sm leading-7">
          Phase one uses mocked data, but the experience is structured for the later Go API and Python AI services.
        </p>
      </div>
    </div>

    <form
      class="grid gap-4 md:grid-cols-2"
      @submit.prevent="handleSubmit"
    >
      <BaseInput
        v-model="form.firstName"
        label="First Name"
        placeholder="First name"
      />
      <BaseInput
        v-model="form.lastName"
        label="Last Name"
        placeholder="Last name"
      />
      <div class="md:col-span-2">
        <BaseInput
          v-model="form.email"
          label="Email Address"
          placeholder="name@example.com"
          type="email"
        />
      </div>
      <div
        v-if="currentRole === 'doctor'"
        class="md:col-span-2"
      >
        <BaseInput
          v-model="form.licenseNumber"
          label="Medical License Number"
          placeholder="STR / License ID"
        />
      </div>
      <BaseInput
        v-model="form.password"
        label="Password"
        placeholder="••••••••"
        type="password"
      />
      <BaseInput
        v-model="confirmPassword"
        label="Confirm Password"
        placeholder="••••••••"
        type="password"
      />
      <div class="md:col-span-2">
        <BaseButton type="submit">
          {{ currentRole === "doctor" ? "Create Doctor Access" : "Create Patient Account" }}
        </BaseButton>
      </div>
    </form>

    <div class="surface-soft rounded-[2rem] p-5">
      <p class="text-sm text-slate-700">
        Already registered?
        <RouterLink
          class="ml-1 font-semibold text-[var(--brand-blue)]"
          :to="`/${currentRole}/login`"
        >
          Return to login
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

import AuthRoleTabs from "@/modules/auth/components/AuthRoleTabs.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import { useSessionStore } from "@/stores/session";
import type { UserRole } from "@/types/domain";

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  licenseNumber: string;
}

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();

const currentRole = computed<UserRole>(() => (route.meta.role as UserRole) ?? "patient");
const confirmPassword = ref("");
const form = ref<RegisterForm>({
  firstName: "Budi",
  lastName: "Santoso",
  email: "patient@example.com",
  password: "password123",
  licenseNumber: "",
});

watch(
  currentRole,
  (role) => {
    form.value = {
      firstName: role === "doctor" ? "Andi" : "Budi",
      lastName: role === "doctor" ? "Setiawan" : "Santoso",
      email: role === "doctor" ? "dr.andi@hospital.com" : "patient@example.com",
      password: "password123",
      licenseNumber: "",
    };
    confirmPassword.value = "password123";
  },
  { immediate: true },
);

const handleSubmit = async () => {
    await sessionStore.register(currentRole.value, form.value);
    await router.push(sessionStore.defaultHomeRoute);
};
</script>
