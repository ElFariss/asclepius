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
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";

import { usePatientStore } from "@/stores/patient";
import { useSessionStore } from "@/stores/session";

const patientStore = usePatientStore();
const sessionStore = useSessionStore();

onMounted(async () => {
  await sessionStore.refreshProfile();
  await Promise.all([patientStore.loadInvite(), patientStore.loadDashboard()]);
});
</script>
