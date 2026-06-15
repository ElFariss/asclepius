<template>
  <div class="archangel-page min-h-screen bg-white text-slate-950">
    <header class="sticky top-0 z-30 border-b border-blue-100/80 bg-white/92 px-4 py-3 backdrop-blur-md md:px-8">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <button
          class="text-left"
          type="button"
          @click="scrollToTop"
        >
          <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">HSIL Hackathon 2026</p>
          <p class="text-lg font-black leading-none tracking-tight">The Archangel</p>
        </button>

        <nav class="hidden items-center gap-6 text-[12px] font-semibold text-slate-500 lg:flex">
          <a href="#problem">Problem</a>
          <a href="#solution">Solution</a>
          <a href="#technicality">AI</a>
          <a href="#business">Business</a>
          <a href="#team">Team</a>
        </nav>

        <div class="flex items-center gap-2">
          <button
            class="hidden rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-bold text-slate-700 sm:block"
            type="button"
            @click="router.push('/patient/login')"
          >
            Patient
          </button>
          <button
            class="hidden rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-bold text-slate-700 sm:block"
            type="button"
            @click="router.push('/doctor/login')"
          >
            Doctor
          </button>
          <button
            class="rounded-full bg-blue-700 px-4 py-2.5 text-[12px] font-bold text-white shadow-lg shadow-blue-200"
            type="button"
            @click="demoOpen = true"
          >
            Demo
          </button>
        </div>
      </div>
    </header>

    <main>
      <section
        id="problem"
        class="slide-shell pt-8 md:pt-12"
      >
        <div class="slide-grid lg:grid-cols-[0.95fr_1.05fr]">
          <article class="slide-panel min-h-[34rem]">
            <PageKicker value="Page 1 - The Problem" />
            <h1 class="slide-title mt-4">The Problem</h1>
            <p class="mt-6 max-w-2xl text-[15px] leading-7 text-slate-700">
              Many surgeries are cancelled or postponed not because of clinical error, but because patients fail to follow
              protocols such as fasting, medication adjustment, or smoking cessation due to lack of guidance and monitoring.
            </p>

            <div class="mt-8 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
              <div class="relative overflow-hidden rounded-[1.2rem] bg-blue-50 p-5">
                <div class="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_25%_20%,#38bdf8,transparent_30%),radial-gradient(circle_at_85%_70%,#1d4ed8,transparent_28%)]" />
                <div class="relative">
                  <p class="text-[3rem] font-black leading-none text-blue-800">28,4</p>
                  <p class="text-xl font-black text-blue-800">Million</p>
                  <p class="mt-2 text-[12px] font-semibold text-blue-900">during COVID-19 pandemic</p>
                  <p class="text-[11px] text-blue-700">(Wijaya, 2025)</p>
                </div>
              </div>

              <div class="space-y-4 border-l border-blue-100 pl-5">
                <p class="text-[14px] leading-7 text-slate-700">
                  In Indonesia's universal healthcare system, JKN/BPJS, every cancelled surgery is a financial leak.
                  When surgery is delayed on the day of the event, the hospital loses the opportunity to treat other patients.
                </p>
                <div>
                  <p class="text-sm font-black">Our Stakeholders</p>
                  <div class="mt-3 grid grid-cols-3 gap-3">
                    <StakeholderCard
                      label="Patients"
                      :icon="UsersRound"
                    />
                    <StakeholderCard
                      label="Surgeons and Care Teams"
                      :icon="Stethoscope"
                    />
                    <StakeholderCard
                      label="Healthcare Systems"
                      :icon="Building2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article class="slide-panel flex min-h-[34rem] flex-col justify-between overflow-hidden">
            <div class="flex items-start justify-between gap-4">
              <PageKicker value="Page 2 - The Archangel" />
              <span class="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">PATH</span>
            </div>
            <div class="my-8">
              <img
                alt="Generated medical AI readiness illustration"
                class="mx-auto w-full max-w-2xl rounded-[1.5rem] object-cover"
                src="/assets/archangel-hero.png"
              />
            </div>
            <div class="border-t border-blue-100 pt-6 text-center">
              <h2 class="text-[2.8rem] font-black leading-none tracking-tight md:text-[4.6rem]">The Archangel</h2>
              <p class="mt-4 text-[15px] font-semibold italic text-slate-600">"Predictive, Preactive, Preventive"</p>
            </div>
          </article>
        </div>
      </section>

      <section
        id="solution"
        class="slide-shell"
      >
        <article class="slide-panel">
          <PageKicker value="Page 3 - Solution value & proposition" />
          <div class="mt-5 grid gap-8 lg:grid-cols-2">
            <div>
              <h2 class="slide-title">Solution value & proposition</h2>
              <h3 class="mt-7 text-xl font-black">How it Creates Value</h3>
              <div class="mt-5 grid gap-4 sm:grid-cols-2">
                <ValueItem
                  title="Instant Clarity"
                  text="Converts complex patient data into Safe | Borderline | Intervene."
                />
                <ValueItem
                  title="Reduced Anxiety"
                  text="Patients track progress; doctors prioritize easily at a glance."
                />
                <ValueItem
                  title="Operational Efficiency"
                  text="Fewer cancellations, better OR utilization and scheduling."
                />
                <ValueItem
                  title="Early Intervention"
                  text="Detect risks days before surgery before they become critical."
                />
              </div>
            </div>
            <div class="border-l border-blue-100 pl-0 lg:pl-8">
              <h3 class="text-xl font-black">The AI Solution</h3>
              <p class="mt-4 text-lg font-bold text-blue-800">Clinical Decision Support System (CDSS)</p>
              <div class="mt-5 space-y-5 text-[14px] leading-7 text-slate-700">
                <p>Integrates patient compliance, vitals such as Hb and BP, and warning signs.</p>
                <p>Outputs risk indicators, early alerts, and actionable recommendations.</p>
                <p>Updated continuously with latest labs and consultations.</p>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section
        id="technicality"
        class="slide-shell"
      >
        <article class="slide-panel">
          <PageKicker value="Page 4 - AI Technicality" />
          <h2 class="slide-title mt-4">AI Technicality</h2>

          <div class="mt-8 grid items-center gap-5 lg:grid-cols-[0.9fr_0.8fr_1fr_0.9fr]">
            <div class="space-y-3">
              <SignalBlock
                title="Compliance Checklist"
                text="Daily activity tracking"
                :icon="ClipboardList"
              />
              <SignalBlock
                title="Vital Signs"
                text="BP, Hb, and more"
                :icon="HeartPulse"
              />
              <SignalBlock
                title="Warning Signs"
                text="Flagged symptoms"
                :icon="TriangleAlert"
              />
            </div>

            <FlowArrow label="Feature Engineering" />

            <div class="rounded-[1.3rem] bg-blue-700 p-6 text-center text-white shadow-xl shadow-blue-200">
              <BrainCircuit
                class="mx-auto"
                :size="40"
              />
              <p class="mt-4 text-lg font-black">Clinical Decision Support System</p>
              <p class="mt-2 text-[12px] font-semibold text-blue-100">CDSS Model</p>
            </div>

            <div class="space-y-3">
              <OutputPill label="Safe to Operate" tone="safe" />
              <OutputPill label="Borderline (Monitor)" tone="borderline" />
              <OutputPill label="Intervene" tone="intervene" />
            </div>
          </div>

          <div class="mt-8 grid gap-5 lg:grid-cols-3">
            <InfoBlock
              title="Patient's App"
              text="View compliance score only, complete daily checklist and restrictions, and view schedule through an integrated calendar."
            />
            <InfoBlock
              title="Ground Truth Update"
              text="Recent results from weekly consultation continuously update the readiness signal."
            />
            <InfoBlock
              title="Doctor's Dashboard"
              text="See all patient risk indicators, receive alerts for bad indicators, and add further actions or recommendations."
            />
          </div>
        </article>
      </section>

      <section
        id="opportunity"
        class="slide-shell"
      >
        <article class="slide-panel">
          <PageKicker value="Page 5 - Opportunity" />
          <div class="mt-5 grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
            <div>
              <h2 class="slide-title">Opportunity</h2>
              <h3 class="mt-7 text-xl font-black">Market Size</h3>
              <ul class="mt-4 space-y-3 text-[14px] leading-7 text-slate-700">
                <li>300M+ surgeries/year globally creates a large unmet need in pre-op readiness.</li>
                <li>10-20% cancellation rate is due to poor preparation.</li>
                <li>Growing Digital Health + AI, with more than $100B TAM.</li>
                <li>Initial focus: private hospitals and surgical centers in Indonesia.</li>
              </ul>

              <h3 class="mt-8 text-xl font-black">Outcome (Transformation)</h3>
              <div class="mt-4 grid grid-cols-2 gap-3">
                <OutcomeTile value="Cancellation" label="rate down" />
                <OutcomeTile value="Doctor" label="efficiency up" />
                <OutcomeTile value="Patient" label="anxiety down" />
                <OutcomeTile value="Reactive" label="to preventive" />
              </div>
            </div>

            <div class="overflow-hidden rounded-[1.3rem] border border-blue-100">
              <table class="w-full text-left text-[12px]">
                <thead class="bg-blue-800 text-white">
                  <tr>
                    <th class="p-3 font-black">Aspect</th>
                    <th class="p-3 font-black">Before</th>
                    <th class="p-3 font-black">After</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-blue-50 text-slate-700">
                  <ComparisonRow aspect="Speed" before="Reactive; issues detected near surgery day" after="Real-time monitoring and early detection days or weeks before" />
                  <ComparisonRow aspect="Accuracy" before="Manual + self-report, inconsistent" after="AI-driven checklist, vitals, and metrics, more reliable" />
                  <ComparisonRow aspect="Accessibility" before="Limited to hospital visits" after="Mobile-based and scalable to rural patients" />
                  <ComparisonRow aspect="Cost" before="High cancellations, repeated tests, inefficiency" after="Lower cost via prevention and better allocation" />
                  <ComparisonRow aspect="Doctor Workflow" before="Time-consuming; hard to track all patients" after="AI triage and alerts focus on high-risk patients" />
                  <ComparisonRow aspect="Patient Experience" before="Unclear progress creates high anxiety" after="Compliance score and guidance reduce anxiety" />
                </tbody>
              </table>
            </div>
          </div>
        </article>
      </section>

      <section class="slide-shell">
        <article class="slide-panel">
          <PageKicker value="Page 6 - Competitors, Our Advantage, Impact" />
          <div class="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr_0.9fr]">
            <PitchColumn title="Competitors">
              <p class="rounded-full bg-orange-100 px-4 py-2 text-center text-[12px] font-black text-orange-700">Telehealth Platforms</p>
              <p>Focus on consultation and medicine delivery.</p>
              <p>No continuous pre-op monitoring.</p>
              <p>No surgical readiness scoring.</p>
            </PitchColumn>

            <div class="rounded-[1.3rem] bg-blue-700 p-7 text-white shadow-xl shadow-blue-200">
              <h2 class="text-2xl font-black">Our Advantage</h2>
              <ul class="mt-5 space-y-3 text-[14px] leading-7 text-blue-50">
                <li>Real-time patient monitoring.</li>
                <li>AI Readiness Score.</li>
                <li>Predicts risk days before surgery.</li>
                <li>Clinical decision support, not just checklist.</li>
              </ul>
              <ShieldCheck
                class="mt-8 text-blue-100"
                :size="72"
              />
            </div>

            <PitchColumn title="Impact">
              <p>Fewer last-minute cancellations.</p>
              <p>Better OR utilization.</p>
              <p>Data-driven surgical decisions.</p>
            </PitchColumn>
          </div>
        </article>
      </section>

      <section
        id="business"
        class="slide-shell"
      >
        <div class="slide-grid lg:grid-cols-2">
          <article class="slide-panel">
            <PageKicker value="Page 7 - Business model" />
            <h2 class="slide-title mt-4">Business model</h2>
            <div class="mt-8 space-y-5 text-[15px] leading-8 text-slate-700">
              <p><strong>B2B SaaS Licensing Fee:</strong> monthly license fee.</p>
              <p><strong>Integration Fees:</strong> one-time setup fee for syncing with existing Hospital Information Systems (HIS).</p>
              <p>
                The timing for this software is exceptionally strategic, driven by a perfect storm of regulatory shifts,
                technological adoption, and financial pressure within the Indonesian healthcare system in 2026.
              </p>
            </div>
          </article>

          <article class="slide-panel">
            <PageKicker value="Page 8 - Go-to-Market Strategy" />
            <h2 class="slide-title mt-4">Go-to-Market Strategy</h2>
            <div class="mt-8 space-y-5">
              <PhaseBlock phase="Phase 1" title="Kick-Off" text="Target private hospital groups such as Siloam and Hermina to prove financial improvement." />
              <PhaseBlock phase="Phase 2" title="Expand" text="Partner with HIS/SIMRS vendors and integrate with our API to scale deployments and refine AI predictive accuracy." />
              <PhaseBlock phase="Phase 3" title="Scale" text="National integration with the app to standardize pre-op protocols across BPJS referral networks." />
            </div>
          </article>
        </div>
      </section>

      <section
        id="ask"
        class="slide-shell"
      >
        <article class="slide-panel">
          <PageKicker value="Page 9 - Ask" />
          <h2 class="slide-title mt-4 text-center">Ask</h2>
          <p class="mx-auto mt-5 max-w-4xl text-center text-[15px] leading-7 text-slate-700">
            We are seeking Rp 2 Billion - Rp 4 Billion in pre-seed funding to build, validate, and pilot our AI-driven
            pre-operative monitoring platform across Indonesia.
          </p>

          <div class="mt-10 grid gap-6 lg:grid-cols-3">
            <NumberList
              title="Use of Funds"
              :items="['Product & Engineering (45%)', 'Clinical Advisory & Validation (20%)', 'Data & Infrastructure (15%)', 'Pilot & Operations (15%)', 'Contingency (5%)']"
            />
            <NumberList
              title="Value Inflection Point"
              :items="['AI is still a strong tailwind', 'More patient data makes the model better', 'Workflow integration creates stickiness']"
            />
            <NumberList
              title="Milestones"
              :items="['Phase 1 - MVP Build (0-4 months)', 'Phase 2 - Pilot in 1-2 hospitals (4-8 months)', 'Phase 3 - Clinical Expansion (8-12 months)', 'Phase 4 - Scaling (12+ months)']"
            />
          </div>
        </article>
      </section>

      <section
        id="team"
        class="slide-shell pb-10"
      >
        <div class="slide-grid lg:grid-cols-2">
          <article class="slide-panel">
            <PageKicker value="Page 10 - Team" />
            <h2 class="slide-title mt-4 text-center">Team</h2>
            <div class="mt-10 grid grid-cols-2 gap-5">
              <TeamTile count="1" label="Software Engineer Lecturer as mentor" :icon="GraduationCap" />
              <TeamTile count="1" label="Health Expert as mentor" :icon="UserRoundCheck" />
              <TeamTile count="3" label="Computer Science Students" :icon="Laptop" />
              <TeamTile count="2" label="Medical Students" :icon="BookOpenCheck" />
            </div>
          </article>

          <article class="slide-panel flex flex-col justify-center text-center">
            <PageKicker value="Page 11 - Summary" />
            <h2 class="slide-title mt-8">Summary</h2>
            <p class="mx-auto mt-8 max-w-3xl text-[17px] leading-8 text-slate-700">
              We stop surgeries from failing before they begin using AI to predict readiness, reduce cancellations,
              and become the intelligence layer behind every surgery.
            </p>
            <p class="mt-10 text-xl font-black italic text-blue-800">"Predictive, Preactive, Preventive"</p>
            <div class="mt-10 flex flex-wrap justify-center gap-3">
              <button
                class="rounded-full bg-blue-700 px-5 py-3 text-[13px] font-black text-white shadow-lg shadow-blue-200"
                type="button"
                @click="demoOpen = true"
              >
                Try Demo
              </button>
              <button
                class="rounded-full border border-slate-200 bg-white px-5 py-3 text-[13px] font-black text-slate-700"
                type="button"
                @click="router.push('/doctor/login')"
              >
                Doctor Login
              </button>
            </div>
          </article>
        </div>
      </section>
    </main>

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
import {
  BookOpenCheck,
  BrainCircuit,
  Building2,
  ClipboardList,
  GraduationCap,
  HeartPulse,
  Laptop,
  ShieldCheck,
  Stethoscope,
  TriangleAlert,
  UserRoundCheck,
  UsersRound,
} from "lucide-vue-next";
import ModalShell from "@/components/ui/ModalShell.vue";
import { useSessionStore } from "@/stores/session";
import type { UserRole } from "@/types/domain";

const router = useRouter();
const sessionStore = useSessionStore();
const demoOpen = ref(false);
const errorMessage = ref("");

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

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

<script lang="ts">
import { defineComponent, h, type FunctionalComponent } from "vue";

export const PageKicker = defineComponent({
  props: { value: { type: String, required: true } },
  setup(props) {
    return () => h("p", { class: "text-[10px] font-black uppercase tracking-[0.22em] text-blue-700" }, props.value);
  },
});

export const StakeholderCard = defineComponent({
  props: {
    label: { type: String, required: true },
    icon: { type: Object as () => FunctionalComponent, required: true },
  },
  setup(props) {
    return () =>
      h("div", { class: "rounded-[1rem] bg-white p-3 text-center shadow-sm ring-1 ring-blue-100" }, [
        h(props.icon, { class: "mx-auto text-blue-700", size: 24 }),
        h("p", { class: "mt-2 text-[11px] font-bold leading-4 text-slate-700" }, props.label),
      ]);
  },
});

export const ValueItem = defineComponent({
  props: {
    title: { type: String, required: true },
    text: { type: String, required: true },
  },
  setup(props) {
    return () =>
      h("div", { class: "border-l-4 border-blue-700 bg-blue-50/70 px-4 py-3" }, [
        h("p", { class: "text-[14px] font-black text-slate-950" }, props.title),
        h("p", { class: "mt-2 text-[12px] leading-5 text-slate-600" }, props.text),
      ]);
  },
});

export const SignalBlock = defineComponent({
  props: {
    title: { type: String, required: true },
    text: { type: String, required: true },
    icon: { type: Object as () => FunctionalComponent, required: true },
  },
  setup(props) {
    return () =>
      h("div", { class: "rounded-full bg-teal-600 px-4 py-3 text-center text-white shadow-sm" }, [
        h(props.icon, { class: "mx-auto mb-1", size: 18 }),
        h("p", { class: "text-[12px] font-black" }, props.title),
        h("p", { class: "text-[10px] text-teal-50" }, props.text),
      ]);
  },
});

export const FlowArrow = defineComponent({
  props: { label: { type: String, required: true } },
  setup(props) {
    return () =>
      h("div", { class: "flex items-center justify-center" }, [
        h("div", { class: "rounded-full bg-sky-100 px-5 py-3 text-center text-[12px] font-black text-blue-800" }, props.label),
      ]);
  },
});

export const OutputPill = defineComponent({
  props: {
    label: { type: String, required: true },
    tone: { type: String, required: true },
  },
  setup(props) {
    const toneClass =
      props.tone === "safe"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : props.tone === "borderline"
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-rose-200 bg-rose-50 text-rose-700";
    return () => h("div", { class: `rounded-full border px-5 py-3 text-center text-[13px] font-black ${toneClass}` }, props.label);
  },
});

export const InfoBlock = defineComponent({
  props: {
    title: { type: String, required: true },
    text: { type: String, required: true },
  },
  setup(props) {
    return () =>
      h("div", { class: "rounded-[1.2rem] bg-slate-950 p-5 text-white" }, [
        h("p", { class: "text-[14px] font-black" }, props.title),
        h("p", { class: "mt-2 text-[12px] leading-6 text-slate-300" }, props.text),
      ]);
  },
});

export const OutcomeTile = defineComponent({
  props: {
    value: { type: String, required: true },
    label: { type: String, required: true },
  },
  setup(props) {
    return () =>
      h("div", { class: "rounded-[1rem] bg-blue-50 p-4" }, [
        h("p", { class: "text-lg font-black text-blue-800" }, props.value),
        h("p", { class: "text-[11px] font-semibold text-blue-700" }, props.label),
      ]);
  },
});

export const ComparisonRow = defineComponent({
  props: {
    aspect: { type: String, required: true },
    before: { type: String, required: true },
    after: { type: String, required: true },
  },
  setup(props) {
    return () =>
      h("tr", [
        h("td", { class: "bg-blue-50 p-3 font-black text-blue-900" }, props.aspect),
        h("td", { class: "p-3" }, props.before),
        h("td", { class: "p-3" }, props.after),
      ]);
  },
});

export const PitchColumn = defineComponent({
  props: { title: { type: String, required: true } },
  setup(props, { slots }) {
    return () =>
      h("div", { class: "rounded-[1.3rem] bg-white p-6 shadow-sm ring-1 ring-blue-100" }, [
        h("h2", { class: "text-2xl font-black uppercase tracking-tight" }, props.title),
        h("div", { class: "mt-5 space-y-4 text-[14px] leading-7 text-slate-700" }, slots.default?.()),
      ]);
  },
});

export const PhaseBlock = defineComponent({
  props: {
    phase: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
  },
  setup(props) {
    return () =>
      h("div", { class: "border-l-4 border-blue-700 pl-4" }, [
        h("p", { class: "text-[11px] font-black uppercase tracking-[0.18em] text-blue-700" }, props.phase),
        h("p", { class: "mt-1 text-lg font-black text-slate-950" }, props.title),
        h("p", { class: "mt-2 text-[13px] leading-6 text-slate-600" }, props.text),
      ]);
  },
});

export const NumberList = defineComponent({
  props: {
    title: { type: String, required: true },
    items: { type: Array as () => string[], required: true },
  },
  setup(props) {
    return () =>
      h("div", { class: "rounded-[1.2rem] bg-blue-50 p-5" }, [
        h("h3", { class: "text-lg font-black" }, props.title),
        h(
          "ol",
          { class: "mt-4 space-y-2 text-[13px] leading-6 text-slate-700" },
          props.items.map((item) => h("li", item)),
        ),
      ]);
  },
});

export const TeamTile = defineComponent({
  props: {
    count: { type: String, required: true },
    label: { type: String, required: true },
    icon: { type: Object as () => FunctionalComponent, required: true },
  },
  setup(props) {
    return () =>
      h("div", { class: "rounded-[1.2rem] bg-blue-50 p-5 text-center" }, [
        h(props.icon, { class: "mx-auto text-blue-700", size: 38 }),
        h("p", { class: "mt-3 text-3xl font-black text-blue-800" }, props.count),
        h("p", { class: "mt-2 text-[12px] font-bold leading-5 text-slate-700" }, props.label),
      ]);
  },
});

export default defineComponent({
  components: {
    ComparisonRow,
    FlowArrow,
    InfoBlock,
    NumberList,
    OutcomeTile,
    OutputPill,
    PageKicker,
    PhaseBlock,
    PitchColumn,
    SignalBlock,
    StakeholderCard,
    TeamTile,
    ValueItem,
  },
});
</script>

<style scoped>
.archangel-page {
  background:
    linear-gradient(180deg, rgba(239, 246, 255, 0.85), rgba(255, 255, 255, 0.96) 22rem),
    radial-gradient(circle at 15% 8%, rgba(37, 99, 235, 0.14), transparent 26rem),
    #ffffff;
}

.slide-shell {
  padding: 1.25rem 1rem;
}

@media (min-width: 768px) {
  .slide-shell {
    padding: 1.75rem 2rem;
  }
}

.slide-grid {
  display: grid;
  gap: 1.25rem;
  max-width: 82rem;
  margin: 0 auto;
}

.slide-panel {
  position: relative;
  overflow: hidden;
  border-top: 3px solid #1d4ed8;
  background: rgba(255, 255, 255, 0.96);
  padding: 1.35rem;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
}

@media (min-width: 768px) {
  .slide-panel {
    padding: 2rem;
  }
}

.slide-title {
  font-size: clamp(2rem, 5vw, 4.6rem);
  line-height: 0.96;
  font-weight: 900;
  letter-spacing: -0.055em;
}
</style>
