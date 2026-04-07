<template>
  <div class="flex h-full flex-col bg-white p-8">
    <div class="mt-8 mb-8 flex flex-col items-center">
      <div
        class="mb-4 flex h-16 w-16 items-center justify-center rounded-[1.5rem] text-white shadow-xl transition-all duration-500"
        :class="currentRole === 'doctor' ? 'bg-blue-600 shadow-blue-200' : 'bg-blue-500 shadow-blue-100'"
      >
        <Stethoscope
          v-if="currentRole === 'doctor'"
          :size="32"
        />
        <User
          v-else
          :size="32"
        />
      </div>
      <h1 class="page-title text-xl font-bold text-slate-900">Create Account</h1>
      <p class="text-sm text-slate-500">Join PreOp as a {{ currentRole }}</p>
    </div>

    <AuthRoleTabs />

    <form
      class="mt-6 space-y-4 overflow-y-auto pr-1"
      @submit.prevent="handleSubmit"
    >
      <div class="grid grid-cols-2 gap-4">
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
      <BaseButton type="submit">
        Create Account
      </BaseButton>
    </form>

    <div class="mt-4 text-center">
      <p class="text-sm text-slate-500">
        Already have an account?
        <RouterLink
          class="ml-1 font-bold text-blue-600 hover:underline"
          :to="`/${currentRole}/login`"
        >
          Login
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
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
const confirmPassword = ref("password123");
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
  await sessionStore.register(currentRole.value, form);
  await router.push(sessionStore.defaultHomeRoute);
};
</script>
