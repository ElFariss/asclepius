<template>
  <div
    v-if="doctorStore.currentPatient"
    class="relative flex h-full flex-col bg-white"
  >
    <div class="flex items-center justify-between border-b border-slate-100 p-6">
      <div class="flex items-center gap-4">
        <button
          class="rounded-full p-2 transition-colors hover:bg-slate-100"
          type="button"
          @click="router.push('/doctor/dashboard')"
        >
          <ArrowLeft :size="20" />
        </button>
        <div>
          <h2 class="page-title text-lg font-bold">{{ doctorStore.currentPatient.name }}</h2>
          <p class="text-[10px] font-bold uppercase text-slate-400">{{ doctorStore.currentPatient.procedure }}</p>
        </div>
      </div>
      <button class="p-2 text-slate-400" type="button">
        <MoreVertical :size="20" />
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-6 pb-24">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div class="space-y-8">
          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p class="mb-1 text-[10px] font-bold uppercase text-slate-400">Compliance</p>
              <div class="flex items-end gap-2">
                <p class="page-title text-2xl font-bold text-blue-600">{{ doctorStore.currentPatient.compliance }}%</p>
                <TrendingUp
                  :size="16"
                  class="mb-1 text-green-500"
                />
              </div>
            </div>
            <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p class="mb-1 text-[10px] font-bold uppercase text-slate-400">Risk Score</p>
              <div class="flex items-end gap-2">
                <p
                  class="page-title text-2xl font-bold"
                  :class="doctorStore.currentPatient.risk === 'High' ? 'text-red-500' : 'text-blue-600'"
                >
                  {{ doctorStore.currentPatient.riskScore }}
                </p>
                <Activity
                  :size="16"
                  class="mb-1 text-slate-300"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 class="mb-4 flex items-center gap-2 text-sm font-bold">
              <TrendingUp
                :size="16"
                class="text-blue-600"
              />
              Last 7 Days Compliance Trend
            </h3>
            <div class="h-64 w-full">
              <TrendChart
                :labels="labels"
                :values="compliance"
                color="#2563eb"
              />
            </div>
          </div>

          <div
            v-if="doctorStore.currentPatient.risk === 'High'"
            class="rounded-2xl border border-red-100 bg-red-50 p-4"
          >
            <div class="mb-4 flex gap-3">
              <AlertCircle class="shrink-0 text-red-500" />
              <div>
                <p class="text-sm font-bold text-red-900">High Risk Warning</p>
                <p class="text-xs leading-relaxed text-red-700">
                  Patient compliance is below 50%. Risk of complications is significantly increased.
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white py-2 text-xs font-bold text-red-600" type="button">
                <MessageSquare :size="14" />
                Contact Patient
              </button>
              <button class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white py-2 text-xs font-bold text-red-600" type="button">
                <Settings :size="14" />
                Modify Protocol
              </button>
            </div>
          </div>
        </div>

        <div class="space-y-8">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="flex items-center gap-2 text-sm font-bold">
                <Calendar
                  :size="16"
                  class="text-blue-600"
                />
                Task Tracker
              </h3>
              <button
                class="text-[10px] font-bold uppercase text-blue-600 hover:underline"
                type="button"
                @click="router.push(`/doctor/patients/${route.params.id}/calendar`)"
              >
                View Full Month
              </button>
            </div>

            <div class="relative rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div class="mb-4 grid grid-cols-7 gap-2">
                <div
                  v-for="(day, index) in weekDays"
                  :key="day"
                  class="text-center"
                >
                  <p class="mb-2 text-[10px] font-bold uppercase text-slate-400">{{ day }}</p>
                  <div
                    class="mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all"
                    :class="index === today ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'border border-slate-100 bg-white text-slate-600'"
                  >
                    {{ 10 + index }}
                  </div>
                  <div class="mt-1 flex justify-center gap-0.5">
                    <div
                      class="h-1 w-1 rounded-full"
                      :class="index < today ? 'bg-green-500' : 'bg-slate-200'"
                    />
                    <div
                      class="h-1 w-1 rounded-full"
                      :class="index < today ? 'bg-green-500' : 'bg-slate-200'"
                    />
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3">
                <div class="flex items-center gap-3">
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Clock :size="16" />
                  </div>
                  <div>
                    <p class="text-[10px] font-bold uppercase text-slate-400">Next Appointment</p>
                    <p class="text-xs font-bold text-slate-900">{{ doctorStore.currentPatient.nextAppointment }}</p>
                  </div>
                </div>
                <ChevronRight
                  :size="16"
                  class="text-slate-300"
                />
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="flex items-center gap-2 text-sm font-bold">
              <ClipboardList
                :size="16"
                class="text-blue-600"
              />
              Today's Patient Tasks
            </h3>
            <div class="space-y-3">
              <div
                v-for="task in doctorStore.currentPatient.tasks"
                :key="task.id"
                class="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-6 w-6 items-center justify-center rounded-lg"
                    :class="task.completed ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'"
                  >
                    <CheckCircle
                      v-if="task.completed"
                      :size="14"
                    />
                    <Clock
                      v-else
                      :size="14"
                    />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-900">{{ task.title }}</p>
                    <p class="text-[10px] font-medium text-slate-400">{{ task.time }}</p>
                  </div>
                </div>
                <div
                  class="rounded-md px-2 py-1 text-[10px] font-bold uppercase"
                  :class="task.completed ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-400'"
                >
                  {{ task.completed ? "Done" : "Pending" }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 border-t border-slate-100 pt-8">
        <h3 class="mb-4 text-sm font-bold">Surgery Decision (Go/No-Go)</h3>
        <div class="flex gap-4">
          <button
            class="flex flex-1 flex-col items-center gap-1 rounded-2xl py-4 text-sm font-bold transition-all"
            :class="doctorStore.surgeryDecision === 'go' ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'border border-slate-100 bg-slate-50 text-slate-400'"
            type="button"
            @click="doctorStore.setSurgeryDecision('go')"
          >
            <CheckCircle :size="20" />
            Proceed Surgery
          </button>
          <button
            class="flex flex-1 flex-col items-center gap-1 rounded-2xl py-4 text-sm font-bold transition-all"
            :class="doctorStore.surgeryDecision === 'no-go' ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'border border-slate-100 bg-slate-50 text-slate-400'"
            type="button"
            @click="doctorStore.setSurgeryDecision('no-go')"
          >
            <Slash :size="20" />
            Postpone / Cancel
          </button>
        </div>
        <p class="mt-4 text-center text-[10px] italic text-slate-400">
          * Final decision remains with the doctor's clinical judgment. Risk scores are for reference only.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Clock,
  MessageSquare,
  MoreVertical,
  Settings,
  Slash,
  TrendingUp,
} from "lucide-vue-next";

import TrendChart from "@/components/charts/TrendChart.vue";
import { progressByPatientIdFixture } from "@/services/fixtures/data";
import { useDoctorStore } from "@/stores/doctor";
import type { ProgressPoint } from "@/types/domain";

const doctorStore = useDoctorStore();
const route = useRoute();
const router = useRouter();

const currentProgress = computed<ProgressPoint[]>(() => progressByPatientIdFixture[route.params.id.toString()] ?? progressByPatientIdFixture.p1);
const labels = computed(() => currentProgress.value.map((point) => point.day));
const compliance = computed(() => currentProgress.value.map((point) => point.compliance));
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const today = 3;

onMounted(async () => {
  await doctorStore.loadPatient(route.params.id.toString());
});
</script>
