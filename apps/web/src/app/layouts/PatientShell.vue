<template>
  <div class="app-shell">
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

    <PatientChatLauncher
      :patient-id="sessionStore.profile?.patientCode ?? patientStore.profile?.id ?? ''"
      :title="patientStore.profile ? `${patientStore.profile.attendingDoctor} Chat` : 'Care Team Chat'"
    />
    <ChatDrawer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";

import ChatDrawer from "@/components/ui/ChatDrawer.vue";
import PatientChatLauncher from "@/components/ui/PatientChatLauncher.vue";
import { usePatientStore } from "@/stores/patient";
import { useSessionStore } from "@/stores/session";

const patientStore = usePatientStore();
const sessionStore = useSessionStore();

onMounted(async () => {
  await sessionStore.refreshProfile();
  await Promise.all([patientStore.loadInvite(), patientStore.loadDashboard()]);
});
</script>
