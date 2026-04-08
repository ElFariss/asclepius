import type { RouteRecordRaw } from "vue-router";

const AuthShell = () => import("@/app/layouts/AuthShell.vue");
const DoctorShell = () => import("@/app/layouts/DoctorShell.vue");
const PatientShell = () => import("@/app/layouts/PatientShell.vue");
const LoginPage = () => import("@/modules/auth/pages/LoginPage.vue");
const RegisterPage = () => import("@/modules/auth/pages/RegisterPage.vue");
const SettingsPage = () => import("@/modules/shared/pages/SettingsPage.vue");
const DoctorAddPatientPage = () => import("@/modules/doctor/pages/DoctorAddPatientPage.vue");
const DoctorCalendarPage = () => import("@/modules/doctor/pages/DoctorCalendarPage.vue");
const DoctorDashboardPage = () => import("@/modules/doctor/pages/DoctorDashboardPage.vue");
const DoctorPatientDetailPage = () => import("@/modules/doctor/pages/DoctorPatientDetailPage.vue");
const PatientChecklistPage = () => import("@/modules/patient/pages/PatientChecklistPage.vue");
const PatientCalendarPage = () => import("@/modules/patient/pages/PatientCalendarPage.vue");
const PatientConsentPage = () => import("@/modules/patient/pages/PatientConsentPage.vue");
const PatientDashboardPage = () => import("@/modules/patient/pages/PatientDashboardPage.vue");
const PatientDietPage = () => import("@/modules/patient/pages/PatientDietPage.vue");
const PatientEmptyPage = () => import("@/modules/patient/pages/PatientEmptyPage.vue");
const PatientInvitePage = () => import("@/modules/patient/pages/PatientInvitePage.vue");
const PatientMedicinesPage = () => import("@/modules/patient/pages/PatientMedicinesPage.vue");
const PatientProgressPage = () => import("@/modules/patient/pages/PatientProgressPage.vue");
const PatientSleepPage = () => import("@/modules/patient/pages/PatientSleepPage.vue");
const PatientSurgeryDetailsPage = () => import("@/modules/patient/pages/PatientSurgeryDetailsPage.vue");

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/patient/login",
  },
  {
    path: "/patient",
    component: AuthShell,
    children: [
      {
        path: "login",
        name: "patient-login",
        component: LoginPage,
        meta: { role: "patient", guestOnly: true },
      },
      {
        path: "register",
        name: "patient-register",
        component: RegisterPage,
        meta: { role: "patient", guestOnly: true },
      },
    ],
  },
  {
    path: "/patient",
    component: PatientShell,
    children: [
      { path: "empty", name: "patient-empty", component: PatientEmptyPage, meta: { role: "patient", requiresAuth: true } },
      { path: "invite", name: "patient-invite", component: PatientInvitePage, meta: { role: "patient", requiresAuth: true } },
      { path: "surgery", name: "patient-surgery", component: PatientSurgeryDetailsPage, meta: { role: "patient", requiresAuth: true } },
      { path: "consent", name: "patient-consent", component: PatientConsentPage, meta: { role: "patient", requiresAuth: true } },
      { path: "dashboard", name: "patient-dashboard", component: PatientDashboardPage, meta: { role: "patient", requiresAuth: true, requiresConsent: true } },
      { path: "medicines", name: "patient-medicines", component: PatientMedicinesPage, meta: { role: "patient", requiresAuth: true, requiresConsent: true } },
      { path: "diet", name: "patient-diet", component: PatientDietPage, meta: { role: "patient", requiresAuth: true, requiresConsent: true } },
      { path: "checklist", name: "patient-checklist", component: PatientChecklistPage, meta: { role: "patient", requiresAuth: true, requiresConsent: true } },
      { path: "calendar", name: "patient-calendar", component: PatientCalendarPage, meta: { role: "patient", requiresAuth: true, requiresConsent: true } },
      { path: "sleep", name: "patient-sleep", component: PatientSleepPage, meta: { role: "patient", requiresAuth: true, requiresConsent: true } },
      { path: "progress", name: "patient-progress", component: PatientProgressPage, meta: { role: "patient", requiresAuth: true, requiresConsent: true } },
      { path: "settings", name: "patient-settings", component: SettingsPage, meta: { role: "patient", requiresAuth: true } },
    ],
  },
  {
    path: "/doctor",
    component: AuthShell,
    children: [
      {
        path: "login",
        name: "doctor-login",
        component: LoginPage,
        meta: { role: "doctor", guestOnly: true },
      },
      {
        path: "register",
        name: "doctor-register",
        component: RegisterPage,
        meta: { role: "doctor", guestOnly: true },
      },
    ],
  },
  {
    path: "/doctor",
    component: DoctorShell,
    children: [
      { path: "dashboard", name: "doctor-dashboard", component: DoctorDashboardPage, meta: { role: "doctor", requiresAuth: true } },
      { path: "patients/new", name: "doctor-add-patient", component: DoctorAddPatientPage, meta: { role: "doctor", requiresAuth: true } },
      { path: "patients/:id", name: "doctor-patient-detail", component: DoctorPatientDetailPage, meta: { role: "doctor", requiresAuth: true } },
      { path: "patients/:id/calendar", name: "doctor-patient-calendar", component: DoctorCalendarPage, meta: { role: "doctor", requiresAuth: true } },
      { path: "settings", name: "doctor-settings", component: SettingsPage, meta: { role: "doctor", requiresAuth: true } },
    ],
  },
];
