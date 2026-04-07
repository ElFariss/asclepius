<template>
  <div class="mesh-shell px-4 py-6 md:px-8">
    <div class="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section class="surface-elevated hidden rounded-[2.5rem] px-8 py-10 lg:flex lg:flex-col lg:justify-between">
        <div class="space-y-6">
          <AppBrand subtitle="AI-powered pre-operative readiness" />
          <div class="max-w-xl space-y-5">
            <p class="eyebrow">Phase One</p>
            <h1 class="page-title text-5xl font-bold leading-tight text-slate-950">
              Surgery preparation designed for confident patients and coordinated clinicians.
            </h1>
            <p class="max-w-lg text-base leading-8 text-[var(--text-muted)]">
              This first release rebuilds the prototype as a responsive Vue app with patient onboarding,
              checklist tracking, progress analysis, and doctor workflow monitoring in one shared experience.
            </p>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="surface-soft rounded-[2rem] p-5">
            <p class="eyebrow">Mobile first</p>
            <p class="mt-2 text-lg font-semibold text-slate-900">Focused patient journey</p>
            <p class="mt-2 text-sm leading-7 text-[var(--text-muted)]">
              Consent, prep requirements, and daily tasks stay clear on smaller screens.
            </p>
          </div>
          <div class="surface-warm rounded-[2rem] p-5">
            <p class="eyebrow">Desktop ready</p>
            <p class="mt-2 text-lg font-semibold text-slate-900">Operational doctor workspace</p>
            <p class="mt-2 text-sm leading-7 text-slate-700">
              Wider layouts prioritize lists, trends, and patient review without a phone-frame shell.
            </p>
          </div>
        </div>
      </section>

      <section class="surface-elevated rounded-[2.5rem] px-5 py-6 md:px-8 md:py-8">
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
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";

import AppBrand from "@/modules/shared/components/AppBrand.vue";
</script>
