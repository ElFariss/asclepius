<template>
  <div class="flex rounded-2xl bg-slate-100 p-1">
    <button
      type="button"
      :class="tabClass('patient')"
      @click="goToRole('patient')"
    >
      Patient
    </button>
    <button
      type="button"
      :class="tabClass('doctor')"
      @click="goToRole('doctor')"
    >
      Doctor
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { cn } from "@/modules/shared/components/cn";
import type { UserRole } from "@/types/domain";

const route = useRoute();
const router = useRouter();

const currentRole = computed<UserRole>(() => (route.meta.role as UserRole) ?? "patient");

const goToRole = (role: UserRole) => {
  const target = route.name?.toString().includes("register") ? "register" : "login";
  void router.push(`/${role}/${target}`);
};

const tabClass = (role: UserRole) =>
  cn(
    "flex-1 rounded-xl py-3 text-xs font-bold transition-all",
    currentRole.value === role
      ? "bg-white text-blue-600 shadow-sm"
      : "text-slate-500",
  );
</script>
