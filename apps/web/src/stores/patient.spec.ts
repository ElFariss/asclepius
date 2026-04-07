import { createPinia, setActivePinia } from "pinia";

import { usePatientStore } from "@/stores/patient";

describe("patient store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("loads dashboard data", async () => {
    const store = usePatientStore();

    await store.loadDashboard();

    expect(store.profile?.name).toBe("Budi Santoso");
    expect(store.tasks.length).toBeGreaterThan(0);
    expect(store.progress.length).toBe(7);
  });

  it("toggles task completion through the mock gateway", async () => {
    const store = usePatientStore();
    await store.loadDashboard();
    const initial = store.completedCount;

    await store.toggleTask("1");

    expect(store.completedCount).toBe(initial + 1);
  });
});
