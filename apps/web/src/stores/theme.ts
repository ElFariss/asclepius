import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";

import type { ThemeMode } from "@/types/domain";

const STORAGE_KEY = "asclepius-theme";

const readTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "blue-medical";
  }

  const raw = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  return raw ?? "blue-medical";
};

const applyTheme = (theme: ThemeMode) => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.theme = theme;
};

export const useThemeStore = defineStore("theme", () => {
  const currentTheme = ref<ThemeMode>(readTheme());
  const settingsOpen = ref(false);

  watch(
    currentTheme,
    (value) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, value);
      }
      applyTheme(value);
    },
    { immediate: true, flush: "sync" },
  );

  const themeLabel = computed(() =>
    currentTheme.value === "blue-medical" ? "Blue Medical" : "Green Forest",
  );

  const setTheme = (theme: ThemeMode) => {
    currentTheme.value = theme;
  };

  const toggleSettings = (open?: boolean) => {
    settingsOpen.value = typeof open === "boolean" ? open : !settingsOpen.value;
  };

  return {
    currentTheme,
    setTheme,
    settingsOpen,
    themeLabel,
    toggleSettings,
  };
});
