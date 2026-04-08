import { createPinia, setActivePinia } from "pinia";

import { useThemeStore } from "@/stores/theme";

describe("theme store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.style.removeProperty("--theme-accent-override");
    setActivePinia(createPinia());
  });

  it("forces the fixed blue medical theme and accent", () => {
    const store = useThemeStore();

    store.setTheme("green-forest");
    store.setAccentColor("#22c55e");

    expect(store.currentTheme).toBe("blue-medical");
    expect(window.localStorage.getItem("asclepius-theme")).toBe("blue-medical");
    expect(window.localStorage.getItem("asclepius-accent")).toBe("#2563eb");
    expect(document.documentElement.dataset.theme).toBe("blue-medical");
    expect(document.documentElement.style.getPropertyValue("--theme-accent-override")).toBe("#2563eb");
  });
});
