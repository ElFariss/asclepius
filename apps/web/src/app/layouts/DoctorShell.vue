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

import { useDoctorStore } from "@/stores/doctor";
import { useSessionStore } from "@/stores/session";

const doctorStore = useDoctorStore();
const sessionStore = useSessionStore();

onMounted(async () => {
  await sessionStore.refreshProfile();
  if (!doctorStore.dashboard) {
    await doctorStore.loadDashboard();
  }
});
</script>
