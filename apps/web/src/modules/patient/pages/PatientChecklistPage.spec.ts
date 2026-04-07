import { render, screen } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";

import PatientChecklistPage from "@/modules/patient/pages/PatientChecklistPage.vue";
import { usePatientStore } from "@/stores/patient";

describe("PatientChecklistPage", () => {
  it("renders current checklist tasks", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const patientStore = usePatientStore();
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: "/patient/dashboard", component: { template: "<div />" } }],
    });
    await router.push("/patient/dashboard");
    await router.isReady();
    patientStore.tasks = [
      { id: "1", title: "Take protein supplement", time: "08:00", completed: false, category: "nutrition" },
      { id: "2", title: "Breathing exercises", time: "10:00", completed: true, category: "exercise" },
    ];

    render(PatientChecklistPage, {
      global: {
        plugins: [pinia, router],
      },
    });

    expect(screen.getByText("Take protein supplement")).toBeInTheDocument();
    expect(screen.getByText("Breathing exercises")).toBeInTheDocument();
    expect(screen.getByText("1/2")).toBeInTheDocument();
  });
});
