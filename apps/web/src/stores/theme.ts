import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";

import type { ThemeMode } from "@/types/domain";

const THEME_STORAGE_KEY = "asclepius-theme";
const ACCENT_STORAGE_KEY = "asclepius-accent";
const FIXED_THEME: ThemeMode = "blue-medical";
const FIXED_ACCENT = "#2563eb";

const readTheme = (): ThemeMode => {
  return FIXED_THEME;
};

const readAccentColor = () => FIXED_ACCENT;

const applyTheme = (theme: ThemeMode, accentColor: string) => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.setProperty("--theme-accent-override", accentColor);
};

export const useThemeStore = defineStore("theme", () => {
  const currentTheme = ref<ThemeMode>(readTheme());
  const accentColor = ref(readAccentColor());

  watch(
    [currentTheme, accentColor],
    () => {
      currentTheme.value = FIXED_THEME;
      accentColor.value = FIXED_ACCENT;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(THEME_STORAGE_KEY, FIXED_THEME);
        window.localStorage.setItem(ACCENT_STORAGE_KEY, FIXED_ACCENT);
      }
      applyTheme(FIXED_THEME, FIXED_ACCENT);
    },
    { immediate: true, flush: "sync" },
  );

  const themeLabel = computed(() => "Blue Medical");

  const setTheme = (_theme: ThemeMode) => {
    currentTheme.value = FIXED_THEME;
  };

  const setAccentColor = (_value: string) => {
    accentColor.value = FIXED_ACCENT;
  };

  const hydrateFromProfile = (_theme: ThemeMode, _accent: string) => {
    currentTheme.value = FIXED_THEME;
    accentColor.value = FIXED_ACCENT;
  };

  return {
    accentColor,
    currentTheme,
    hydrateFromProfile,
    setAccentColor,
    setTheme,
    themeLabel,
  };
});
