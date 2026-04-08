<template>
  <div class="relative min-h-screen overflow-hidden px-4 py-8 md:px-8">
    <NeuralLoginBackground />

    <div class="relative z-10 grid min-h-[calc(100vh-4rem)] w-full overflow-hidden rounded-[2rem] bg-transparent lg:grid-cols-[0.9fr_1.1fr]">
      <div class="hidden rounded-[2rem] bg-white/72 p-10 shadow-2xl shadow-slate-200/50 backdrop-blur-sm lg:flex lg:flex-col lg:justify-between">
        <div>
          <p class="eyebrow">Account setup</p>
          <h1 class="page-title mt-4 text-[2.2rem] font-bold text-slate-900">
            Create your {{ currentRole }} workspace.
          </h1>
          <p class="mt-5 max-w-md text-[13px] leading-7 text-slate-500">
            New accounts are written to the backend so profile, settings, and future care-plan activity stay available across sessions.
          </p>
        </div>

        <div class="rounded-[1.5rem] bg-slate-50 p-6">
          <p class="text-[13px] font-semibold text-slate-900">What gets created now</p>
          <ul class="mt-4 space-y-3 text-[13px] text-slate-600">
            <li>Real login credentials</li>
            <li>Profile and avatar settings</li>
            <li>Patient record creation for patient accounts</li>
          </ul>
        </div>
      </div>

      <div class="flex items-center justify-center p-8">
        <div class="w-full max-w-2xl">
          <div class="mb-8 flex flex-col items-center text-center">
            <div
              class="theme-accent-bg mb-4 flex h-20 w-20 items-center justify-center rounded-[2rem] text-white"
            >
              <Stethoscope
                v-if="currentRole === 'doctor'"
                :size="36"
              />
              <User
                v-else
                :size="36"
              />
            </div>
          </div>

          <AuthRoleTabs />

          <form
            class="mt-8 space-y-4"
            @submit.prevent="handleSubmit"
          >
            <div class="grid gap-4 md:grid-cols-2">
              <BaseInput
                v-model="form.firstName"
                label="First Name"
                placeholder="First Name"
              />
              <BaseInput
                v-model="form.lastName"
                label="Last Name"
                placeholder="Last Name"
              />
            </div>
            <BaseInput
              v-model="form.email"
              label="Email Address"
              placeholder="name@example.com"
              type="email"
            />
            <BaseInput
              v-if="currentRole === 'doctor'"
              v-model="form.licenseNumber"
              label="Medical License Number"
              placeholder="STR / License ID"
            />
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
            <div
              v-if="errorMessage"
              class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700"
            >
              {{ errorMessage }}
            </div>

            <BaseButton
              :disabled="submitting"
              type="submit"
            >
              Create Account
            </BaseButton>
          </form>

          <div class="mt-6 flex justify-center">
            <div class="rounded-2xl bg-white/88 px-5 py-3 text-center shadow-lg shadow-slate-950/10 ring-1 ring-white/60 backdrop-blur-sm">
              <p class="text-sm text-slate-500">
                Already have an account?
                <RouterLink
                  class="ml-1 font-bold theme-accent-text hover:underline"
                  :to="`/${currentRole}/login`"
                >
                  Login
                </RouterLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { Stethoscope, User } from "lucide-vue-next";

import NeuralLoginBackground from "@/components/auth/NeuralLoginBackground.vue";
import { ApiError } from "@/services/http/client";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import AuthRoleTabs from "@/modules/auth/components/AuthRoleTabs.vue";
import { useSessionStore } from "@/stores/session";
import type { UserRole } from "@/types/domain";

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();

const currentRole = computed<UserRole>(() => (route.meta.role as UserRole) ?? "patient");
const confirmPassword = ref("password123");
const errorMessage = ref("");
const submitting = ref(false);
const form = reactive({
  firstName: "Budi",
  lastName: "Santoso",
  email: "patient@example.com",
  password: "password123",
  licenseNumber: "",
});

watch(
  currentRole,
  (role) => {
    errorMessage.value = "";
    form.firstName = role === "doctor" ? "Andi" : "Budi";
    form.lastName = role === "doctor" ? "Setiawan" : "Santoso";
    form.email = role === "doctor" ? "dr.andi@hospital.com" : "patient@example.com";
    form.password = "password123";
    form.licenseNumber = "";
    confirmPassword.value = "password123";
  },
  { immediate: true },
);

const handleSubmit = async () => {
  errorMessage.value = "";
  if (confirmPassword.value !== form.password) {
    errorMessage.value = "Password confirmation does not match.";
    return;
  }
  submitting.value = true;
  try {
    await sessionStore.register(currentRole.value, form);
    await router.push(sessionStore.defaultHomeRoute);
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : "Unable to create the account right now. Please try again.";
  } finally {
    submitting.value = false;
  }
};
</script>
