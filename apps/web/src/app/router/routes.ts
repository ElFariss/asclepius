import type { RouteRecordRaw } from "vue-router";

const AuthShell = () => import("@/app/layouts/AuthShell.vue");
const DoctorShell = () => import("@/app/layouts/DoctorShell.vue");
const PatientShell = () => import("@/app/layouts/PatientShell.vue");
const LoginPage = () => import("@/modules/auth/pages/LoginPage.vue");
const RegisterPage = () => import("@/modules/auth/pages/RegisterPage.vue");
const DoctorAddPatientPage = () => import("@/modules/doctor/pages/DoctorAddPatientPage.vue");
const DoctorCalendarPage = () => import("@/modules/doctor/pages/DoctorCalendarPage.vue");
const DoctorDashboardPage = () => import("@/modules/doctor/pages/DoctorDashboardPage.vue");
const DoctorPatientDetailPage = () => import("@/modules/doctor/pages/DoctorPatientDetailPage.vue");
const PatientChecklistPage = () => import("@/modules/patient/pages/PatientChecklistPage.vue");
const PatientConsentPage = () => import("@/modules/patient/pages/PatientConsentPage.vue");
const PatientDashboardPage = () => import("@/modules/patient/pages/PatientDashboardPage.vue");
const PatientInvitePage = () => import("@/modules/patient/pages/PatientInvitePage.vue");
const PatientProgressPage = () => import("@/modules/patient/pages/PatientProgressPage.vue");
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
      {
        path: "invite",
        name: "patient-invite",
        component: PatientInvitePage,
        meta: { role: "patient", requiresAuth: true },
      },
      {
        path: "surgery",
        name: "patient-surgery",
        component: PatientSurgeryDetailsPage,
        meta: { role: "patient", requiresAuth: true },
      },
      {
        path: "consent",
        name: "patient-consent",
        component: PatientConsentPage,
        meta: { role: "patient", requiresAuth: true },
      },
      {
        path: "dashboard",
        name: "patient-dashboard",
        component: PatientDashboardPage,
        meta: { role: "patient", requiresAuth: true, requiresConsent: true },
      },
      {
        path: "checklist",
        name: "patient-checklist",
        component: PatientChecklistPage,
        meta: { role: "patient", requiresAuth: true, requiresConsent: true },
      },
      {
        path: "progress",
        name: "patient-progress",
        component: PatientProgressPage,
        meta: { role: "patient", requiresAuth: true, requiresConsent: true },
      },
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
      {
        path: "dashboard",
        name: "doctor-dashboard",
        component: DoctorDashboardPage,
        meta: { role: "doctor", requiresAuth: true },
      },
      {
        path: "patients/new",
        name: "doctor-add-patient",
        component: DoctorAddPatientPage,
        meta: { role: "doctor", requiresAuth: true },
      },
      {
        path: "patients/:id",
        name: "doctor-patient-detail",
        component: DoctorPatientDetailPage,
        meta: { role: "doctor", requiresAuth: true },
      },
      {
        path: "patients/:id/calendar",
        name: "doctor-patient-calendar",
        component: DoctorCalendarPage,
        meta: { role: "doctor", requiresAuth: true },
      },
    ],
  },
];
