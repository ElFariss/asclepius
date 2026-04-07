<template>
  <div class="mesh-shell px-3 py-4 md:px-6 md:py-6">
    <div class="mx-auto flex max-w-7xl flex-col gap-5">
      <header class="surface-elevated flex flex-col gap-5 rounded-[2rem] px-5 py-5 md:px-7">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="eyebrow">Patient Experience</p>
            <h1 class="page-title mt-2 text-2xl font-bold">Preparation companion</h1>
            <p class="muted-copy mt-2 text-sm">
              {{ sessionStore.displayName || "Patient" }} stays aligned with surgery milestones, consent, and daily prep tasks.
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <RouterLink
              v-for="item in navItems"
              :key="item.to"
              :class="navClass(item.to)"
              :to="item.to"
            >
              {{ item.label }}
            </RouterLink>
            <button
              class="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-red-600"
              type="button"
              @click="handleLogout"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
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

        <aside class="space-y-5">
          <section class="surface-elevated rounded-[2rem] p-5">
            <p class="eyebrow">Readiness Summary</p>
            <div class="mt-4 space-y-4">
              <div>
                <p class="text-3xl font-bold text-[var(--brand-blue)]">
                  {{ patientStore.profile?.daysUntilSurgery ?? "--" }} days
                </p>
                <p class="muted-copy text-sm">Until surgery date</p>
              </div>
              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="muted-copy">Compliance</span>
                  <span class="font-semibold text-slate-900">{{ patientStore.profile?.compliance ?? "--" }}%</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="muted-copy">Risk score</span>
                  <span class="font-semibold text-slate-900">{{ patientStore.profile?.riskScore ?? "--" }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="muted-copy">Next appointment</span>
                  <span class="font-semibold text-slate-900">{{ patientStore.profile?.nextAppointment ?? "--" }}</span>
                </div>
              </div>
            </div>
          </section>

          <section class="surface-soft rounded-[2rem] p-5">
            <p class="eyebrow">Checklist Snapshot</p>
            <p class="mt-4 text-lg font-semibold text-slate-900">
              {{ patientStore.completedCount }}/{{ patientStore.tasks.length || 4 }} tasks completed
            </p>
            <p class="muted-copy mt-2 text-sm leading-7">
              Honest daily completion keeps the surgical risk profile grounded in reality and helps the team act early.
            </p>
          </section>

          <section class="surface-warm rounded-[2rem] p-5">
            <p class="eyebrow">Surgeon</p>
            <p class="mt-3 text-lg font-semibold text-slate-900">{{ patientStore.profile?.attendingDoctor ?? "Dr. Andi Setiawan" }}</p>
            <p class="mt-1 text-sm text-slate-700">{{ patientStore.profile?.specialty ?? "General Surgery Specialist" }}</p>
            <p class="mt-3 text-sm leading-7 text-slate-700">
              Keep your consent, fasting, and breathing routines up to date before the next clinical review.
            </p>
          </section>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter, RouterLink, RouterView } from "vue-router";

import { usePatientStore } from "@/stores/patient";
import { useSessionStore } from "@/stores/session";

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();
const patientStore = usePatientStore();

const navItems = [
  { label: "Invite", to: "/patient/invite" },
  { label: "Dashboard", to: "/patient/dashboard" },
  { label: "Checklist", to: "/patient/checklist" },
  { label: "Progress", to: "/patient/progress" },
];

const navClass = (target: string) =>
  route.path === target
    ? "rounded-full bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-white"
    : "rounded-full bg-white/65 px-4 py-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--text-primary)]";

const handleLogout = async () => {
  await sessionStore.logout();
  await router.push("/patient/login");
};

onMounted(async () => {
  await Promise.all([patientStore.loadInvite(), patientStore.loadDashboard()]);
});
</script>
