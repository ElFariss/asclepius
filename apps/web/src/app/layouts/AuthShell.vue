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
import { RouterView } from "vue-router";
</script>
