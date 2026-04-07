import type { RouteLocationNormalizedGeneric } from "vue-router";

import type { UserRole } from "@/types/domain";

export interface SessionSnapshot {
  isAuthenticated: boolean;
  role: UserRole | null;
  consentAccepted: boolean;
  defaultHomeRoute: string;
}

export const resolveRouteAccess = (
  to: RouteLocationNormalizedGeneric,
  session: SessionSnapshot,
) => {
  const routeRole = to.meta.role as UserRole | undefined;
  const requiresAuth = Boolean(to.meta.requiresAuth);
  const requiresConsent = Boolean(to.meta.requiresConsent);
  const guestOnly = Boolean(to.meta.guestOnly);

  if (guestOnly && session.isAuthenticated && routeRole === session.role) {
    return session.defaultHomeRoute;
  }

  if (requiresAuth && !session.isAuthenticated) {
    return routeRole === "doctor" ? "/doctor/login" : "/patient/login";
  }

  if (requiresAuth && routeRole && session.role && routeRole !== session.role) {
    return session.defaultHomeRoute;
  }

  if (requiresConsent && session.role === "patient" && !session.consentAccepted) {
    return "/patient/consent";
  }

  if (to.path === "/patient/consent" && session.role === "patient" && session.consentAccepted) {
    return "/patient/dashboard";
  }

  return true;
};
