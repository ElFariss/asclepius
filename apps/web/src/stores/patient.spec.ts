import { createPinia, setActivePinia } from "pinia";
import { vi } from "vitest";

import { usePatientStore } from "@/stores/patient";
import { useSessionStore } from "@/stores/session";

describe("patient store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    vi.restoreAllMocks();
    setActivePinia(createPinia());
  });

  it("loads dashboard data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn()
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              id: "p1",
              name: "Budi Santoso",
              email: "patient@example.com",
              avatarUrl: "",
              procedure: "Laparoscopic Cholecystectomy",
              compliance: 91,
              risk: "Low",
              riskScore: 6,
              status: "On Track",
              inviteStatus: "active",
              surgeryDate: "April 15, 2026",
              daysUntilSurgery: 12,
              attendingDoctor: "Dr. Andi Setiawan",
              specialty: "Digestive & Oncology Surgery",
              hospitalStay: "1 - 2 Days",
              surgeryDuration: "60 - 90 Minutes",
              nextAppointment: "Tomorrow, 09:00 AM",
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          ),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify([{ id: "1", title: "Take protein supplement", time: "08:00", completed: false, category: "nutrition" }]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify([{ day: "Mon", compliance: 85, risk: 12 }]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify([{ id: "m1", name: "Cefuroxime", description: "Test", schedule: { amount: "1 tablet", frequency: "every 8 hours", mealTiming: "after-eating", nextDoseAt: "2026-04-08T08:00:00.000Z" } }]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify([{ id: "d1", name: "Lean chicken soup", type: "mandatory" }]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ label: "April 2026", focusMonth: 4, year: 2026, events: [] }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ targetHours: 7, averageHours: 7.1, meetsTarget: true, entries: [] }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        ),
    );

    const sessionStore = useSessionStore();
    sessionStore.session = {
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
    };

    const store = usePatientStore();
    await store.loadDashboard();

    expect(store.profile?.name).toBe("Budi Santoso");
    expect(store.tasks.length).toBeGreaterThan(0);
    expect(store.progress.length).toBe(1);
    expect(store.medications.length).toBeGreaterThan(0);
    expect(store.diet.length).toBeGreaterThan(0);
  });

  it("toggles task completion through the api gateway", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify([{ id: "1", title: "Take protein supplement", time: "08:00", completed: true, category: "nutrition" }]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    const sessionStore = useSessionStore();
    sessionStore.session = {
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
    };

    const store = usePatientStore();
    store.tasks = [{ id: "1", title: "Take protein supplement", time: "08:00", completed: false, category: "nutrition" }];

    await store.toggleTask("1");

    expect(store.completedCount).toBe(1);
  });
});
