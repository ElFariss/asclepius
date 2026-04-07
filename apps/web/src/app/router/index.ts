import { createRouter, createWebHistory } from "vue-router";

import { resolveRouteAccess } from "@/app/guards/access";
import { routes } from "@/app/router/routes";
import { useSessionStore } from "@/stores/session";

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const sessionStore = useSessionStore();
  sessionStore.hydrate();

  return resolveRouteAccess(to, {
    isAuthenticated: sessionStore.isAuthenticated,
    role: sessionStore.role,
    consentAccepted: sessionStore.consentAccepted,
    defaultHomeRoute: sessionStore.defaultHomeRoute,
  });
});
