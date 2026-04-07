import { createPinia, setActivePinia } from "pinia";

import { useThemeStore } from "@/stores/theme";

describe("theme store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    setActivePinia(createPinia());
  });

  it("persists and applies the selected theme", () => {
    const store = useThemeStore();

    store.setTheme("green-forest");

    expect(store.currentTheme).toBe("green-forest");
    expect(window.localStorage.getItem("asclepius-theme")).toBe("green-forest");
    expect(document.documentElement.dataset.theme).toBe("green-forest");
  });
});
