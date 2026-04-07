import { resolveRouteAccess } from "@/app/guards/access";

const makeRoute = (path: string, meta: Record<string, unknown>) =>
  ({
    path,
    meta,
  }) as never;

describe("resolveRouteAccess", () => {
  it("redirects unauthenticated users to the role login route", () => {
    const result = resolveRouteAccess(makeRoute("/doctor/dashboard", { role: "doctor", requiresAuth: true }), {
      isAuthenticated: false,
      role: null,
      consentAccepted: false,
      defaultHomeRoute: "/patient/login",
    });

    expect(result).toBe("/doctor/login");
  });

  it("redirects authenticated guest routes to the default home route", () => {
    const result = resolveRouteAccess(makeRoute("/patient/login", { role: "patient", guestOnly: true }), {
      isAuthenticated: true,
      role: "patient",
      consentAccepted: false,
      defaultHomeRoute: "/patient/invite",
    });

    expect(result).toBe("/patient/invite");
  });

  it("redirects consent-protected patient routes when consent is missing", () => {
    const result = resolveRouteAccess(makeRoute("/patient/dashboard", { role: "patient", requiresAuth: true, requiresConsent: true }), {
      isAuthenticated: true,
      role: "patient",
      consentAccepted: false,
      defaultHomeRoute: "/patient/invite",
    });

    expect(result).toBe("/patient/consent");
  });
});
