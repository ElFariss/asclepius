import { createPinia, setActivePinia } from "pinia";
import { vi } from "vitest";

import { useSessionStore } from "@/stores/session";

describe("session store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    vi.restoreAllMocks();
    setActivePinia(createPinia());
  });

  it("logs a patient in and computes the invite route", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn()
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              token: "token-1",
              session: {
                token: "token-1",
                userId: "patient-1",
                role: "patient",
                displayName: "Budi Santoso",
                email: "patient@example.com",
                avatarUrl: "",
                themeMode: "blue-medical",
                accentColor: "#2563eb",
                consentAccepted: false,
                patientStage: "empty",
              },
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          ),
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              id: "patient-1",
              role: "patient",
              email: "patient@example.com",
              displayName: "Budi Santoso",
              firstName: "Budi",
              lastName: "Santoso",
              licenseNumber: "",
              avatarUrl: "",
              themeMode: "blue-medical",
              accentColor: "#2563eb",
              patientCode: "p1",
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          ),
        ),
    );

    const store = useSessionStore();

    await store.login("patient", {
      email: "patient@example.com",
      password: "password123",
    });

    expect(store.isAuthenticated).toBe(true);
    expect(store.defaultHomeRoute).toBe("/patient/empty");
  });

  it("accepts consent and redirects the patient home to the dashboard", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn()
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              token: "token-1",
              session: {
                token: "token-1",
                userId: "patient-1",
                role: "patient",
                displayName: "Budi Santoso",
                email: "patient@example.com",
                avatarUrl: "",
                themeMode: "blue-medical",
                accentColor: "#2563eb",
                consentAccepted: false,
                patientStage: "empty",
              },
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          ),
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              id: "patient-1",
              role: "patient",
              email: "patient@example.com",
              displayName: "Budi Santoso",
              firstName: "Budi",
              lastName: "Santoso",
              licenseNumber: "",
              avatarUrl: "",
              themeMode: "blue-medical",
              accentColor: "#2563eb",
              patientCode: "p1",
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          ),
        )
        .mockResolvedValueOnce(
          new Response(null, {
            status: 204,
          }),
        ),
    );

    const store = useSessionStore();

    await store.login("patient", {
      email: "patient@example.com",
      password: "password123",
    });
    await store.acceptConsent();

    expect(store.consentAccepted).toBe(true);
    expect(store.defaultHomeRoute).toBe("/patient/dashboard");
  });
});
