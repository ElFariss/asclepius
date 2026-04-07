import { createPinia, setActivePinia } from "pinia";

import { registry } from "@/services/adapters/mockRegistry";
import { usePatientStore } from "@/stores/patient";

describe("patient store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    registry.reset();
    setActivePinia(createPinia());
  });

  it("loads dashboard data", async () => {
    const store = usePatientStore();

    await store.loadDashboard();

    expect(store.profile?.name).toBe("Budi Santoso");
    expect(store.tasks.length).toBeGreaterThan(0);
    expect(store.progress.length).toBe(7);
    expect(store.medications.length).toBeGreaterThan(0);
    expect(store.diet.length).toBeGreaterThan(0);
  });

  it("toggles task completion through the mock gateway", async () => {
    const store = usePatientStore();
    await store.loadDashboard();
    const initial = store.completedCount;

    await store.toggleTask("1");

    expect(store.completedCount).toBe(initial + 1);
  });
});
