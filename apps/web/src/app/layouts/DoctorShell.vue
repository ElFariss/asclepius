<template>
  <div class="mesh-shell px-3 py-4 md:px-6 md:py-6">
    <div class="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside class="surface-elevated rounded-[2rem] px-5 py-6">
        <div class="space-y-6">
          <AppBrand subtitle="Clinician operations workspace" />

          <div>
            <p class="eyebrow">Doctor Console</p>
            <p class="mt-2 text-xl font-semibold text-slate-900">Dr. {{ doctorStore.dashboard?.doctorName ?? "Andi Setiawan" }}</p>
            <p class="muted-copy mt-1 text-sm">{{ doctorStore.dashboard?.title ?? "General Surgery" }}</p>
          </div>

          <nav class="space-y-2">
            <RouterLink
              :class="navClass('/doctor/dashboard')"
              to="/doctor/dashboard"
            >
              Dashboard
            </RouterLink>
            <RouterLink
              :class="navClass('/doctor/patients/new')"
              to="/doctor/patients/new"
            >
              Add patient
            </RouterLink>
          </nav>

          <div class="space-y-3 rounded-[1.6rem] bg-white/60 p-4">
            <div class="flex items-center justify-between text-sm">
              <span class="muted-copy">Active patients</span>
              <span class="font-semibold text-slate-900">{{ doctorStore.dashboard?.activePatients ?? 24 }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="muted-copy">Needs intervention</span>
              <span class="font-semibold text-amber-700">{{ doctorStore.dashboard?.needsIntervention ?? 3 }}</span>
            </div>
          </div>

          <button
            class="w-full rounded-full bg-white/75 px-4 py-3 text-sm font-semibold text-[var(--text-muted)] transition hover:text-red-600"
            type="button"
            @click="handleLogout"
          >
            Log out
          </button>
        </div>
      </aside>

      <main class="surface-elevated rounded-[2rem] px-4 py-4 md:px-6 md:py-6">
        <RouterView v-slot="{ Component, route }">
          <Transition
            mode="out-in"
            name="route-fade"
          >
            <component
              :is="Component"
              :key="route.fullPath"
            />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter, RouterLink, RouterView } from "vue-router";

import AppBrand from "@/modules/shared/components/AppBrand.vue";
import { useDoctorStore } from "@/stores/doctor";
import { useSessionStore } from "@/stores/session";

const doctorStore = useDoctorStore();
const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();

const navClass = (target: string) =>
  route.path === target
    ? "block rounded-[1.25rem] bg-[var(--brand-blue)] px-4 py-3 text-sm font-semibold text-white"
    : "block rounded-[1.25rem] bg-white/65 px-4 py-3 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--text-primary)]";

const handleLogout = async () => {
  await sessionStore.logout();
  await router.push("/doctor/login");
};

onMounted(async () => {
  if (!doctorStore.dashboard) {
    await doctorStore.loadDashboard();
  }
});
</script>
