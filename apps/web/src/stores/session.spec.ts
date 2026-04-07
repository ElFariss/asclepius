import { createPinia, setActivePinia } from "pinia";

import { useSessionStore } from "@/stores/session";

describe("session store", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    setActivePinia(createPinia());
  });

  it("logs a patient in and computes the invite route", async () => {
    const store = useSessionStore();

    await store.login("patient", {
      email: "patient@example.com",
      password: "password123",
    });

    expect(store.isAuthenticated).toBe(true);
    expect(store.defaultHomeRoute).toBe("/patient/invite");
  });

  it("accepts consent and redirects the patient home to the dashboard", async () => {
    const store = useSessionStore();

    await store.login("patient", {
      email: "patient@example.com",
      password: "password123",
    });
    store.acceptConsent();

    expect(store.consentAccepted).toBe(true);
    expect(store.defaultHomeRoute).toBe("/patient/dashboard");
  });
});
