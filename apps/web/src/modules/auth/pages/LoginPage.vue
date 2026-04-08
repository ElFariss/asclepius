<template>
  <div class="relative min-h-screen overflow-hidden">
    <NeuralLoginBackground />

    <div class="relative z-10 grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <div class="hidden px-10 py-12 lg:flex lg:flex-col lg:justify-between">
        <div class="max-w-lg">
          <p class="eyebrow text-white/70">PreOp Companion</p>
          <h1 class="page-title mt-4 text-[2.65rem] font-bold leading-tight text-white">
            Surgical readiness with a clearer desktop and mobile workflow.
          </h1>
          <p class="mt-5 max-w-md text-[14px] leading-7 text-white/75">
            Track invitations, calendars, medicines, diet, and preparation details across patient and doctor experiences with one connected system.
          </p>
        </div>

      </div>

      <div class="flex items-center justify-center px-4 py-8 md:px-8 lg:justify-end lg:py-12">
        <div class="w-full max-w-xl bg-white/0 p-6 shadow-none backdrop-blur-0 md:p-8">
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
            <BaseInput
              v-model="form.email"
              label="Email Address"
              :placeholder="currentRole === 'doctor' ? 'dr.andi@hospital.com' : 'patient@example.com'"
              type="email"
            />
            <BaseInput
              v-model="form.password"
              label="Password"
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
              Login to Dashboard
            </BaseButton>
          </form>

          <div class="mt-6 flex justify-center">
            <div class="rounded-2xl bg-white/88 px-5 py-3 text-center shadow-lg shadow-slate-950/10 ring-1 ring-white/60 backdrop-blur-sm">
              <p class="text-sm text-slate-500">
                Don't have an account?
                <RouterLink
                  class="ml-1 font-bold theme-accent-text hover:underline"
                  :to="`/${currentRole}/register`"
                >
                  Register Now
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

import { ApiError } from "@/services/http/client";
import NeuralLoginBackground from "@/components/auth/NeuralLoginBackground.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import AuthRoleTabs from "@/modules/auth/components/AuthRoleTabs.vue";
import { useSessionStore } from "@/stores/session";
import type { UserRole } from "@/types/domain";

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();

const currentRole = computed<UserRole>(() => (route.meta.role as UserRole) ?? "patient");
const errorMessage = ref("");
const submitting = ref(false);
const form = reactive({
  email: "patient@example.com",
  password: "password123",
});

watch(
  currentRole,
  (role) => {
    errorMessage.value = "";
    form.email = role === "doctor" ? "dr.andi@hospital.com" : "patient@example.com";
    form.password = "password123";
  },
  { immediate: true },
);

const handleSubmit = async () => {
  errorMessage.value = "";
  submitting.value = true;
  try {
    await sessionStore.login(currentRole.value, form);
    await router.push(sessionStore.defaultHomeRoute);
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : "Unable to sign in right now. Please try again.";
  } finally {
    submitting.value = false;
  }
};
</script>
