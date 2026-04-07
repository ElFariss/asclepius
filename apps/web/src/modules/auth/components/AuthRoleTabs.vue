<template>
  <div class="inline-flex rounded-full bg-white/70 p-1 shadow-[var(--shadow-soft)]">
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
    "rounded-full px-4 py-2 text-sm font-semibold transition",
    currentRole.value === role
      ? "bg-[var(--brand-blue)] text-white"
      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
  );
</script>
