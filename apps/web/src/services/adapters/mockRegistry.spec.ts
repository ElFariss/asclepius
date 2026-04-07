import { registry } from "@/services/adapters/mockRegistry";

describe("mock registry", () => {
  beforeEach(() => {
    window.localStorage.clear();
    registry.reset();
  });

  it("creates a pending invite and flips dashboard status to pending acceptance", () => {
    registry.finalizePendingInvite({
      patientId: "p1",
      surgeryDate: "2026-04-18",
      surgeryDocument: null,
      medications: [],
      diet: [],
    });

    const patient = registry.getDoctorDashboard().patients.find((item) => item.id === "p1");

    expect(patient?.inviteStatus).toBe("pending-acceptance");
    expect(patient?.status).toBe("Pending Acceptance");
    expect(registry.getPatientInvite("p1").hasPendingUpdate).toBe(true);
  });

  it("activates a pending invite when the patient accepts it", () => {
    registry.finalizePendingInvite({
      patientId: "p1",
      surgeryDate: "2026-04-18",
      surgeryDocument: null,
      medications: [],
      diet: [],
    });

    registry.acceptInvite("p1");

    const patient = registry.getDoctorDashboard().patients.find((item) => item.id === "p1");

    expect(patient?.inviteStatus).toBe("active");
    expect(registry.getPatientInvite("p1").hasPendingUpdate).toBe(false);
  });

  it("returns safe fallback plan data for a lookup-only patient before activation", () => {
    const invite = registry.getPatientInvite("p4");
    const medications = registry.getMedicationPlan("p4");
    const diet = registry.getDietPlan("p4");
    const sleep = registry.getSleepSummary("p4");

    expect(invite.patientId).toBe("p4");
    expect(invite.hasPendingUpdate).toBe(false);
    expect(medications).toEqual([]);
    expect(diet).toEqual([]);
    expect(sleep.entries.length).toBeGreaterThan(0);
  });
});
