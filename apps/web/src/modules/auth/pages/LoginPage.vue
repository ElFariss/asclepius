<template>
  <div class="flex h-full flex-col bg-white p-8">
    <div class="mt-12 mb-8 flex flex-col items-center">
      <div
        class="mb-4 flex h-20 w-20 items-center justify-center rounded-[2rem] text-white shadow-xl transition-all duration-500"
        :class="currentRole === 'doctor' ? 'bg-blue-600 shadow-blue-200' : 'bg-blue-500 shadow-blue-100'"
      >
        <Stethoscope
          v-if="currentRole === 'doctor'"
          :size="40"
        />
        <User
          v-else
          :size="40"
        />
      </div>
      <h1 class="page-title text-2xl font-bold text-slate-900">
        PreOp {{ currentRole === "doctor" ? "Doctor" : "Patient" }}
      </h1>
      <p class="text-sm text-slate-500">
        {{ currentRole === "doctor" ? "Patient Management Portal" : "Your Surgery Preparation Companion" }}
      </p>
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
      <BaseButton type="submit">
        Login to Dashboard
      </BaseButton>
    </form>

    <div class="mt-6 text-center">
      <p class="text-sm text-slate-500">
        Don't have an account?
        <RouterLink
          class="ml-1 font-bold text-blue-600 hover:underline"
          :to="`/${currentRole}/register`"
        >
          Register Now
        </RouterLink>
      </p>
    </div>

    <p class="mt-auto text-center text-[10px] text-slate-400">
      {{
        currentRole === "doctor"
          ? "Session will automatically end after 30 minutes of inactivity."
          : "Your data is encrypted and stored securely."
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { Stethoscope, User } from "lucide-vue-next";

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
  email: "patient@example.com",
  password: "password123",
});

watch(
  currentRole,
  (role) => {
    form.email = role === "doctor" ? "dr.andi@hospital.com" : "patient@example.com";
    form.password = "password123";
  },
  { immediate: true },
);

const handleSubmit = async () => {
  await sessionStore.login(currentRole.value, form);
  await router.push(sessionStore.defaultHomeRoute);
};
</script>
