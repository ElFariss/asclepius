import { render, screen } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";

import PatientChecklistPage from "@/modules/patient/pages/PatientChecklistPage.vue";
import { usePatientStore } from "@/stores/patient";

describe("PatientChecklistPage", () => {
  it("renders current checklist tasks", () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const patientStore = usePatientStore();
    patientStore.tasks = [
      { id: "1", title: "Take protein supplement", time: "08:00", completed: false, category: "nutrition" },
      { id: "2", title: "Breathing exercises", time: "10:00", completed: true, category: "exercise" },
    ];

    render(PatientChecklistPage, {
      global: {
        plugins: [pinia],
      },
    });

    expect(screen.getByText("Take protein supplement")).toBeInTheDocument();
    expect(screen.getByText("Breathing exercises")).toBeInTheDocument();
    expect(screen.getByText("1/2 done")).toBeInTheDocument();
  });
});
