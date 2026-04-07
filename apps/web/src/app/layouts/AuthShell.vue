<template>
  <div class="prototype-viewport">
    <div class="prototype-frame">
      <button
        class="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-md transition hover:text-slate-900"
        type="button"
        @click="themeStore.toggleSettings(true)"
      >
        <Settings :size="18" />
      </button>
      <section class="flex-1">
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
      <SettingsModal />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Settings } from "lucide-vue-next";
import { RouterView } from "vue-router";

import SettingsModal from "@/components/ui/SettingsModal.vue";
import { useThemeStore } from "@/stores/theme";

const themeStore = useThemeStore();
</script>
