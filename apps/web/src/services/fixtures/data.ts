import type {
  DoctorDashboardData,
  Patient,
  PatientDetail,
  PatientInvite,
  PatientTask,
  ProgressPoint,
  Protocol,
} from "@/types/domain";

export const progressSeries: ProgressPoint[] = [
  { day: "Mon", compliance: 85, risk: 12 },
  { day: "Tue", compliance: 90, risk: 10 },
  { day: "Wed", compliance: 75, risk: 15 },
  { day: "Thu", compliance: 95, risk: 8 },
  { day: "Fri", compliance: 100, risk: 5 },
  { day: "Sat", compliance: 92, risk: 7 },
  { day: "Sun", compliance: 98, risk: 6 },
];

export const patientTasksFixture: PatientTask[] = [
  { id: "1", title: "Take protein supplement", time: "08:00", completed: false, category: "nutrition" },
  { id: "2", title: "Breathing exercises", time: "10:00", completed: true, category: "exercise" },
  { id: "3", title: "Afternoon walk", time: "16:00", completed: false, category: "exercise" },
  { id: "4", title: "Start fasting", time: "22:00", completed: false, category: "nutrition" },
];

export const patientFixture: Patient = {
  id: "p1",
  name: "Budi Santoso",
  procedure: "Laparoscopic Cholecystectomy",
  compliance: 91,
  risk: "Low",
  riskScore: 6,
  status: "On Track",
  surgeryDate: "April 15, 2026",
  daysUntilSurgery: 12,
  attendingDoctor: "Dr. Andi Setiawan",
  specialty: "Digestive & Oncology Surgery",
  hospitalStay: "1 - 2 Days",
  surgeryDuration: "60 - 90 Minutes",
  lastConsultation: "Yesterday, 14:20",
  streak: 5,
  nextAppointment: "Tomorrow, 09:00 AM",
};

export const inviteFixture: PatientInvite = {
  doctorName: "Dr. Andi Setiawan",
  specialty: "General Surgery Specialist",
  procedure: patientFixture.procedure,
  surgeryDate: patientFixture.surgeryDate,
};

export const doctorDashboardFixture: DoctorDashboardData = {
  doctorName: "Andi Setiawan",
  title: "General Surgery",
  activePatients: 24,
  needsIntervention: 3,
  patients: [
    { id: "p1", name: "Budi Santoso", procedure: "Cholecystectomy", compliance: 91, risk: "Low", riskScore: 6, status: "On Track" },
    { id: "p2", name: "Siti Aminah", procedure: "Herniorrhaphy", compliance: 45, risk: "High", riskScore: 18, status: "Needs Intervention" },
    { id: "p3", name: "Agus Wijaya", procedure: "Appendectomy", compliance: 78, risk: "Medium", riskScore: 11, status: "Warning" },
  ],
};

export const patientDetailsFixture: Record<string, PatientDetail> = {
  p1: {
    ...doctorDashboardFixture.patients[0],
    nextAppointment: "Tomorrow, 09:00 AM",
    tasks: patientTasksFixture,
    notes: "High compliance and good breathing routine. Continue daily nutritional checks.",
  },
  p2: {
    ...doctorDashboardFixture.patients[1],
    nextAppointment: "Today, 15:30 PM",
    tasks: [
      { id: "t1", title: "Morning medication", time: "08:00", completed: true, category: "medication" },
      { id: "t2", title: "Walk 15 mins", time: "11:00", completed: false, category: "exercise" },
      { id: "t3", title: "Avoid smoking", time: "All day", completed: false, category: "nutrition" },
      { id: "t4", title: "Evening medication", time: "20:00", completed: false, category: "medication" },
    ],
    notes: "Requires proactive outreach. Compliance remains below threshold for safe readiness.",
  },
  p3: {
    ...doctorDashboardFixture.patients[2],
    nextAppointment: "Friday, 10:00 AM",
    tasks: [
      { id: "t1", title: "Protein intake check", time: "08:30", completed: true, category: "nutrition" },
      { id: "t2", title: "Breathing exercise", time: "13:00", completed: true, category: "exercise" },
      { id: "t3", title: "Hydration tracking", time: "All day", completed: false, category: "nutrition" },
      { id: "t4", title: "Walk 10 mins", time: "17:00", completed: false, category: "exercise" },
    ],
    notes: "Moderate compliance. Adjust communication cadence if risk score rises again.",
  },
};

export const protocolsFixture: Protocol[] = [
  { id: "pr1", name: "Standard Laparoscopic", category: "General Surgery", tasks: 12 },
  { id: "pr2", name: "Enhanced Recovery (ERAS)", category: "Digestive", tasks: 18 },
  { id: "pr3", name: "Geriatric Specialized", category: "General", tasks: 15 },
];
