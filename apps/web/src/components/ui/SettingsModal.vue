<template>
  <ModalShell
    :open="themeStore.settingsOpen"
    close-label="Done"
    description="Theme changes are persisted for both patient and doctor experiences."
    title="Settings"
    @close="themeStore.toggleSettings(false)"
  >
    <div class="space-y-4 p-6">
      <button
        class="flex w-full items-center justify-between rounded-[1.75rem] border px-5 py-4 text-left transition"
        :class="themeStore.currentTheme === 'blue-medical' ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white'"
        type="button"
        @click="themeStore.setTheme('blue-medical')"
      >
        <div>
          <p class="font-semibold text-slate-900">Blue Medical</p>
          <p class="mt-1 text-sm text-slate-500">Clinical blue accents with the original medical feel.</p>
        </div>
        <div class="h-10 w-10 rounded-full bg-blue-600" />
      </button>
      <button
        class="flex w-full items-center justify-between rounded-[1.75rem] border px-5 py-4 text-left transition"
        :class="themeStore.currentTheme === 'green-forest' ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'"
        type="button"
        @click="themeStore.setTheme('green-forest')"
      >
        <div>
          <p class="font-semibold text-slate-900">Green Forest</p>
          <p class="mt-1 text-sm text-slate-500">A calmer green variant while keeping the same interface layout.</p>
        </div>
        <div class="h-10 w-10 rounded-full bg-emerald-600" />
      </button>
    </div>
  </ModalShell>
</template>

<script setup lang="ts">
import ModalShell from "@/components/ui/ModalShell.vue";
import { useThemeStore } from "@/stores/theme";

const themeStore = useThemeStore();
</script>
