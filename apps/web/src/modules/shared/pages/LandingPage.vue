<template>
  <div class="min-h-screen bg-[color:var(--surface-page)] text-slate-900">
    <section class="relative overflow-hidden px-4 py-6 md:px-8 md:py-8">
      <div class="mx-auto max-w-7xl space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <AppBrand subtitle="Pre-operative intelligence for every operation" />
          <div class="flex flex-wrap gap-3">
            <button
              class="rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-[13px] font-semibold text-slate-700"
              type="button"
              @click="router.push('/patient/login')"
            >
              Patient Login
            </button>
            <button
              class="rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-[13px] font-semibold text-slate-700"
              type="button"
              @click="router.push('/doctor/login')"
            >
              Doctor Login
            </button>
            <button
              class="theme-accent-bg rounded-[1rem] px-4 py-3 text-[13px] font-semibold text-white"
              type="button"
              @click="demoOpen = true"
            >
              Demo
            </button>
          </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div class="rounded-[1.8rem] bg-white p-6 shadow-2xl shadow-slate-200/60 md:p-8">
            <p class="eyebrow">The Archangel</p>
            <h1 class="page-title mt-3 text-[2.2rem] font-bold leading-tight md:text-[3rem]">
              Predictive, Predictive, Preactive
            </h1>
            <p class="mt-4 max-w-2xl text-[14px] leading-7 text-slate-600">
              We stop surgeries from failing before they begin, using AI to predict readiness, reduce cancellations,
              and become the intelligence layer behind every operation.
            </p>

            <div class="mt-6 grid gap-3 sm:grid-cols-3">
              <div class="rounded-[1.2rem] bg-[color:var(--surface-subtle)] p-4">
                <p class="eyebrow">Instant Clarity</p>
                <p class="mt-2 text-[13px] leading-6 text-slate-600">Complex patient data becomes Safe, Borderline, or Intervene.</p>
              </div>
              <div class="rounded-[1.2rem] bg-[color:var(--surface-subtle)] p-4">
                <p class="eyebrow">Early Intervention</p>
                <p class="mt-2 text-[13px] leading-6 text-slate-600">Risks surface days before surgery instead of on the operating day.</p>
              </div>
              <div class="rounded-[1.2rem] bg-[color:var(--surface-subtle)] p-4">
                <p class="eyebrow">Operational Efficiency</p>
                <p class="mt-2 text-[13px] leading-6 text-slate-600">Fewer cancellations and stronger OR scheduling discipline.</p>
              </div>
            </div>
          </div>

          <div class="grid gap-4">
            <div class="rounded-[1.6rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/15">
              <p class="eyebrow text-slate-400">The Problem</p>
              <p class="mt-3 text-[14px] leading-7 text-slate-200">
                Many surgeries fail or are postponed not because of clinical error, but because patients fail to follow
                protocols such as fasting, medication adjustment, or smoking cessation due to lack of guidance and monitoring.
              </p>
            </div>
            <div class="rounded-[1.6rem] bg-white p-6 shadow-xl shadow-slate-200/50">
              <p class="eyebrow">Indonesia Context</p>
              <p class="mt-3 text-[14px] leading-7 text-slate-600">
                In Indonesia&apos;s JKN/BPJS system, every cancelled surgery is a financial leak. When surgery is delayed
                on the event day, the hospital loses the chance to treat another patient. 28.4 million procedures were
                disrupted during the COVID-19 period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="px-4 py-4 md:px-8">
      <div class="mx-auto max-w-7xl grid gap-4 md:grid-cols-3">
        <article class="rounded-[1.5rem] bg-white p-5 shadow-xl shadow-slate-200/40">
          <p class="eyebrow">Our Stakeholders</p>
          <h2 class="page-title mt-3 text-lg font-bold">Patients</h2>
          <p class="mt-2 text-[13px] leading-6 text-slate-600">Clear progress, lower anxiety, and step-by-step readiness guidance.</p>
        </article>
        <article class="rounded-[1.5rem] bg-white p-5 shadow-xl shadow-slate-200/40">
          <p class="eyebrow">Our Stakeholders</p>
          <h2 class="page-title mt-3 text-lg font-bold">Surgeons and Care Teams</h2>
          <p class="mt-2 text-[13px] leading-6 text-slate-600">Prioritized patients, earlier alerts, and faster intervention decisions.</p>
        </article>
        <article class="rounded-[1.5rem] bg-white p-5 shadow-xl shadow-slate-200/40">
          <p class="eyebrow">Our Stakeholders</p>
          <h2 class="page-title mt-3 text-lg font-bold">Healthcare Systems</h2>
          <p class="mt-2 text-[13px] leading-6 text-slate-600">Better resource allocation, fewer repeated tests, and tighter OR utilization.</p>
        </article>
      </div>
    </section>

    <section class="px-4 py-4 md:px-8">
      <div class="mx-auto max-w-7xl grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article class="rounded-[1.7rem] bg-white p-6 shadow-xl shadow-slate-200/50">
          <p class="eyebrow">How It Creates Value</p>
          <h2 class="page-title mt-3 text-xl font-bold">The AI Solution</h2>
          <div class="mt-5 grid gap-3 sm:grid-cols-2">
            <div class="rounded-[1.2rem] bg-[color:var(--surface-subtle)] p-4">
              <p class="font-semibold text-slate-900">Compliance Checklist</p>
              <p class="mt-2 text-[13px] text-slate-600">Daily activity tracking.</p>
            </div>
            <div class="rounded-[1.2rem] bg-[color:var(--surface-subtle)] p-4">
              <p class="font-semibold text-slate-900">Vital Signs</p>
              <p class="mt-2 text-[13px] text-slate-600">BP, Hb, and other readiness indicators.</p>
            </div>
            <div class="rounded-[1.2rem] bg-[color:var(--surface-subtle)] p-4">
              <p class="font-semibold text-slate-900">Warning Signs</p>
              <p class="mt-2 text-[13px] text-slate-600">Flagged symptoms and abnormal findings.</p>
            </div>
            <div class="rounded-[1.2rem] bg-[color:var(--surface-subtle)] p-4">
              <p class="font-semibold text-slate-900">Ground Truth Update</p>
              <p class="mt-2 text-[13px] text-slate-600">Recent results from weekly consultation.</p>
            </div>
          </div>
          <div class="mt-5 rounded-[1.2rem] bg-slate-950 p-5 text-white">
            <p class="text-sm font-semibold">Clinical Decision Support System (CDSS)</p>
            <p class="mt-2 text-[13px] leading-6 text-slate-300">
              Integrates patient compliance, vitals, and warning signs to output risk indicators, early alerts, and
              actionable recommendations that are continuously updated with new consultations and labs.
            </p>
          </div>
        </article>

        <article class="rounded-[1.7rem] bg-white p-6 shadow-xl shadow-slate-200/50">
          <p class="eyebrow">Solution Value & Proposition</p>
          <div class="mt-4 space-y-4">
            <div class="rounded-[1.2rem] bg-[color:var(--surface-subtle)] p-4">
              <p class="font-semibold text-slate-900">Reduced Anxiety</p>
              <p class="mt-2 text-[13px] text-slate-600">Patients track progress while doctors prioritize easily at a glance.</p>
            </div>
            <div class="rounded-[1.2rem] bg-[color:var(--surface-subtle)] p-4">
              <p class="font-semibold text-slate-900">Doctor&apos;s Dashboard</p>
              <p class="mt-2 text-[13px] text-slate-600">See all patients, risk indicators, alerts, and recommended follow-up actions.</p>
            </div>
            <div class="rounded-[1.2rem] bg-[color:var(--surface-subtle)] p-4">
              <p class="font-semibold text-slate-900">Patient&apos;s App</p>
              <p class="mt-2 text-[13px] text-slate-600">View compliance score, complete daily restrictions, and follow the integrated calendar.</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="px-4 py-4 md:px-8">
      <div class="mx-auto max-w-7xl rounded-[1.7rem] bg-white p-6 shadow-xl shadow-slate-200/50">
        <p class="eyebrow">AI Technicality</p>
        <div class="mt-5 overflow-x-auto">
          <table class="min-w-full text-left text-[13px]">
            <thead class="text-slate-400">
              <tr>
                <th class="pb-3 pr-4 font-medium">Aspect</th>
                <th class="pb-3 pr-4 font-medium">Before</th>
                <th class="pb-3 font-medium">After</th>
              </tr>
            </thead>
            <tbody class="align-top text-slate-600">
              <tr><td class="py-3 pr-4 font-semibold text-slate-900">Speed</td><td class="py-3 pr-4">Reactive, detected near surgery day</td><td class="py-3">Real-time monitoring with earlier detection days or weeks before surgery</td></tr>
              <tr><td class="py-3 pr-4 font-semibold text-slate-900">Accuracy</td><td class="py-3 pr-4">Manual and self-reported, inconsistent</td><td class="py-3">AI-driven checklist, vitals, and metrics improve reliability</td></tr>
              <tr><td class="py-3 pr-4 font-semibold text-slate-900">Accessibility</td><td class="py-3 pr-4">Limited to hospital visits</td><td class="py-3">Mobile-based monitoring scales to rural patients</td></tr>
              <tr><td class="py-3 pr-4 font-semibold text-slate-900">Cost</td><td class="py-3 pr-4">High from cancellations and inefficiency</td><td class="py-3">Lower cost through prevention and better allocation</td></tr>
              <tr><td class="py-3 pr-4 font-semibold text-slate-900">Doctor Workflow</td><td class="py-3 pr-4">Time-consuming and hard to track all patients</td><td class="py-3">AI triage and alerts focus attention on high-risk patients</td></tr>
              <tr><td class="py-3 pr-4 font-semibold text-slate-900">Patient Experience</td><td class="py-3 pr-4">Unclear progress, high anxiety</td><td class="py-3">Compliance score and guidance reduce anxiety</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="px-4 py-4 md:px-8">
      <div class="mx-auto max-w-7xl grid gap-6 lg:grid-cols-3">
        <article class="rounded-[1.6rem] bg-white p-6 shadow-xl shadow-slate-200/50 lg:col-span-2">
          <p class="eyebrow">Opportunity</p>
          <h2 class="page-title mt-3 text-xl font-bold">Market Size</h2>
          <div class="mt-4 space-y-3 text-[13px] leading-6 text-slate-600">
            <p>300M+ surgeries per year globally creates a large unmet need in pre-op readiness.</p>
            <p>10–20% cancellation rates are still driven by poor preparation.</p>
            <p>Digital health and AI continue to grow toward a $100B+ TAM.</p>
            <p>Initial SOM targets private hospitals and surgical centers in Indonesia.</p>
          </div>
        </article>
        <article class="rounded-[1.6rem] bg-white p-6 shadow-xl shadow-slate-200/50">
          <p class="eyebrow">Outcome</p>
          <div class="mt-4 space-y-3 text-[13px] leading-6 text-slate-600">
            <p>Cancellation rate decreases.</p>
            <p>Doctor efficiency increases through AI triage and alerts.</p>
            <p>Patient anxiety decreases through clearer readiness signals.</p>
            <p>Healthcare shifts from reactive to preventive.</p>
          </div>
        </article>
      </div>
    </section>

    <section class="px-4 py-4 md:px-8">
      <div class="mx-auto max-w-7xl grid gap-6 lg:grid-cols-2">
        <article class="rounded-[1.6rem] bg-white p-6 shadow-xl shadow-slate-200/50">
          <p class="eyebrow">Competitors</p>
          <p class="mt-4 text-[13px] leading-6 text-slate-600">
            Telehealth platforms focus on consultation and medicine delivery, but they do not provide continuous
            pre-op monitoring or surgical readiness scoring.
          </p>
        </article>
        <article class="rounded-[1.6rem] bg-white p-6 shadow-xl shadow-slate-200/50">
          <p class="eyebrow">Our Advantage</p>
          <div class="mt-4 space-y-3 text-[13px] leading-6 text-slate-600">
            <p>Real-time patient monitoring.</p>
            <p>AI readiness score with Safe, Borderline, and Intervene output.</p>
            <p>Predicts risk days before surgery.</p>
            <p>Clinical decision support, not just a checklist.</p>
          </div>
        </article>
      </div>
    </section>

    <section class="px-4 py-4 md:px-8">
      <div class="mx-auto max-w-7xl grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article class="rounded-[1.6rem] bg-white p-6 shadow-xl shadow-slate-200/50">
          <p class="eyebrow">Business Model</p>
          <div class="mt-4 space-y-3 text-[13px] leading-6 text-slate-600">
            <p>B2B SaaS licensing fee through monthly subscriptions.</p>
            <p>One-time integration fees for syncing with existing hospital information systems.</p>
            <p>The timing is strategic because regulation, AI adoption, and financial pressure are all converging in Indonesia.</p>
          </div>
        </article>
        <article class="rounded-[1.6rem] bg-white p-6 shadow-xl shadow-slate-200/50">
          <p class="eyebrow">Go-to-Market Strategy</p>
          <div class="mt-4 space-y-3 text-[13px] leading-6 text-slate-600">
            <p>Phase 1: target private hospital groups such as Siloam and Hermina to prove financial improvement.</p>
            <p>Phase 2: partner with HIS vendors and refine predictive accuracy through API integrations.</p>
            <p>Phase 3: scale through referral networks and national protocol standardization.</p>
          </div>
        </article>
      </div>
    </section>

    <section class="px-4 py-4 pb-10 md:px-8">
      <div class="mx-auto max-w-7xl grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article class="rounded-[1.6rem] bg-white p-6 shadow-xl shadow-slate-200/50">
          <p class="eyebrow">Ask</p>
          <p class="mt-4 text-[13px] leading-6 text-slate-600">
            We are seeking Rp 2 Billion – Rp 4 Billion in pre-seed funding to build, validate, and pilot this AI-driven
            pre-operative monitoring platform across Indonesia.
          </p>
          <div class="mt-5 space-y-2 text-[13px] leading-6 text-slate-600">
            <p>Product & Engineering: 45%</p>
            <p>Clinical Advisory & Validation: 20%</p>
            <p>Data & Infrastructure: 15%</p>
            <p>Pilot & Operations: 15%</p>
            <p>Contingency: 5%</p>
          </div>
        </article>
        <article class="rounded-[1.6rem] bg-white p-6 shadow-xl shadow-slate-200/50">
          <p class="eyebrow">Milestones and Team</p>
          <div class="mt-4 space-y-3 text-[13px] leading-6 text-slate-600">
            <p>Phase 1 MVP Build: 0–4 months</p>
            <p>Phase 2 Pilot in 1–2 hospitals: 4–8 months</p>
            <p>Phase 3 Clinical Expansion: 8–12 months</p>
            <p>Phase 4 Scaling: 12+ months</p>
            <p>Team: 3 computer science students, 2 medical students, 1 health expert mentor, and 1 software engineering lecturer mentor.</p>
          </div>
        </article>
      </div>
    </section>

    <ModalShell
      :open="demoOpen"
      description="Choose a role to enter the isolated demo sandbox."
      title="Start Demo"
      @close="demoOpen = false"
    >
      <div class="space-y-4 p-6">
        <button
          class="w-full rounded-[1.1rem] border border-slate-200 bg-white px-4 py-4 text-left shadow-sm"
          type="button"
          @click="startDemo('doctor')"
        >
          <p class="font-semibold text-slate-900">Doctor Demo</p>
          <p class="mt-1 text-[12px] text-slate-500">Open the demo doctor dashboard with seeded patients and actions.</p>
        </button>
        <button
          class="w-full rounded-[1.1rem] border border-slate-200 bg-white px-4 py-4 text-left shadow-sm"
          type="button"
          @click="startDemo('patient')"
        >
          <p class="font-semibold text-slate-900">Patient Demo</p>
          <p class="mt-1 text-[12px] text-slate-500">Open the demo patient experience with medicines, calendar, and checklist.</p>
        </button>
        <p
          v-if="errorMessage"
          class="rounded-[1rem] bg-rose-50 px-4 py-3 text-[12px] text-rose-600"
        >
          {{ errorMessage }}
        </p>
      </div>
    </ModalShell>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import ModalShell from "@/components/ui/ModalShell.vue";
import AppBrand from "@/modules/shared/components/AppBrand.vue";
import { useSessionStore } from "@/stores/session";
import type { UserRole } from "@/types/domain";

const router = useRouter();
const sessionStore = useSessionStore();
const demoOpen = ref(false);
const errorMessage = ref("");

const startDemo = async (role: UserRole) => {
  errorMessage.value = "";
  try {
    await sessionStore.createDemoSession(role);
    demoOpen.value = false;
    await router.push(sessionStore.defaultHomeRoute);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "Unable to start the demo session.";
  }
};
</script>
