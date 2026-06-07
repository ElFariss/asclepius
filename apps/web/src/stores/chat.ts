import { ref } from "vue";
import { defineStore } from "pinia";

import { doctorGateway, patientGateway } from "@/services/adapters/mockAdapters";
import { useSessionStore } from "@/stores/session";
import type { ChatThread } from "@/types/domain";

const POLL_INTERVAL_MS = 5000;

export const useChatStore = defineStore("chat", () => {
  const thread = ref<ChatThread | null>(null);
  const patientId = ref("");
  const title = ref("Care Chat");
  const open = ref(false);
  const loading = ref(false);
  const sending = ref(false);
  const lastError = ref("");

  const sessionStore = useSessionStore();
  let pollHandle: number | null = null;

  const stopPolling = () => {
    if (pollHandle !== null && typeof window !== "undefined") {
      window.clearInterval(pollHandle);
      pollHandle = null;
    }
  };

  const loadThread = async () => {
    if (!sessionStore.token || !patientId.value) {
      thread.value = null;
      return;
    }

    loading.value = true;
    lastError.value = "";
    try {
      thread.value =
        sessionStore.role === "doctor"
          ? await doctorGateway.getChat(sessionStore.token, patientId.value)
          : await patientGateway.getChat(sessionStore.token);
    } catch (error) {
      lastError.value = error instanceof Error ? error.message : "Unable to load chat.";
    } finally {
      loading.value = false;
    }
  };

  const startPolling = () => {
    stopPolling();
    if (typeof window === "undefined") {
      return;
    }
    pollHandle = window.setInterval(() => {
      if (open.value && patientId.value) {
        void loadThread();
      }
    }, POLL_INTERVAL_MS);
  };

  const openThread = async (nextPatientId: string, nextTitle: string) => {
    patientId.value = nextPatientId;
    title.value = nextTitle;
    open.value = true;
    await loadThread();
    startPolling();
  };

  const closeThread = () => {
    open.value = false;
    stopPolling();
  };

  const sendMessage = async (body: string) => {
    if (!sessionStore.token || !patientId.value || !body.trim()) {
      return;
    }

    sending.value = true;
    lastError.value = "";
    try {
      if (sessionStore.role === "doctor") {
        await doctorGateway.sendChat(sessionStore.token, patientId.value, { body });
      } else {
        await patientGateway.sendChat(sessionStore.token, { body });
      }
      await loadThread();
    } catch (error) {
      lastError.value = error instanceof Error ? error.message : "Unable to send message.";
    } finally {
      sending.value = false;
    }
  };

  const reset = () => {
    stopPolling();
    thread.value = null;
    patientId.value = "";
    title.value = "Care Chat";
    open.value = false;
    loading.value = false;
    sending.value = false;
    lastError.value = "";
  };

  return {
    closeThread,
    lastError,
    loadThread,
    loading,
    open,
    openThread,
    patientId,
    reset,
    sendMessage,
    sending,
    thread,
    title,
  };
});
