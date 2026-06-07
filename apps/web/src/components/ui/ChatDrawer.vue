<template>
  <Teleport to="body">
    <Transition name="route-fade">
      <div
        v-if="chatStore.open"
        class="fixed inset-0 z-50 flex justify-end bg-slate-950/20 backdrop-blur-[1px]"
        @click.self="chatStore.closeThread()"
      >
        <aside class="flex h-full w-full max-w-md flex-col bg-white shadow-2xl shadow-slate-900/20">
          <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <p class="eyebrow">Chat</p>
              <h2 class="page-title text-base font-bold text-slate-900">{{ chatStore.title }}</h2>
            </div>
            <button
              class="rounded-full border border-slate-200 bg-white p-2 text-slate-500"
              type="button"
              @click="chatStore.closeThread()"
            >
              <X :size="18" />
            </button>
          </div>

          <div class="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
            <p
              v-if="chatStore.loading"
              class="text-[12px] text-slate-500"
            >
              Loading conversation...
            </p>

            <div
              v-for="message in chatStore.thread?.messages ?? []"
              :key="message.id"
              class="flex"
              :class="message.senderRole === sessionStore.role ? 'justify-end' : 'justify-start'"
            >
              <div
                class="max-w-[85%] rounded-[1.2rem] px-4 py-3 shadow-sm"
                :class="message.senderRole === sessionStore.role ? 'theme-accent-bg text-white' : 'bg-white text-slate-900'"
              >
                <p class="text-[11px] font-bold opacity-80">{{ message.senderName }}</p>
                <p class="mt-1 whitespace-pre-wrap text-[13px] leading-6">{{ message.body }}</p>
                <p class="mt-2 text-[10px] opacity-70">{{ formatTime(message.createdAt) }}</p>
              </div>
            </div>

            <div
              v-if="!chatStore.loading && !(chatStore.thread?.messages.length)"
              class="rounded-[1.2rem] bg-white px-4 py-6 text-center text-[12px] text-slate-500"
            >
              No messages yet.
            </div>
          </div>

          <div class="border-t border-slate-100 bg-white px-4 py-4">
            <p
              v-if="chatStore.lastError"
              class="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-[12px] text-rose-600"
            >
              {{ chatStore.lastError }}
            </p>

            <label class="block space-y-2">
              <span class="eyebrow">Message</span>
              <textarea
                v-model="draft"
                class="min-h-24 w-full rounded-[1.1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-900 outline-none"
                placeholder="Write a quick update..."
              />
            </label>

            <div class="mt-3 flex justify-end gap-3">
              <button
                class="rounded-[1rem] bg-slate-100 px-4 py-3 text-[13px] font-semibold text-slate-700"
                type="button"
                @click="chatStore.closeThread()"
              >
                Close
              </button>
              <button
                class="theme-accent-bg rounded-[1rem] px-4 py-3 text-[13px] font-semibold text-white disabled:opacity-60"
                :disabled="chatStore.sending || !draft.trim()"
                type="button"
                @click="submit"
              >
                Send
              </button>
            </div>
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { X } from "lucide-vue-next";

import { useChatStore } from "@/stores/chat";
import { useSessionStore } from "@/stores/session";

const chatStore = useChatStore();
const sessionStore = useSessionStore();
const draft = ref("");

watch(
  () => chatStore.open,
  (isOpen) => {
    if (!isOpen) {
      draft.value = "";
    }
  },
);

const formatTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const submit = async () => {
  const body = draft.value.trim();
  if (!body) {
    return;
  }
  await chatStore.sendMessage(body);
  draft.value = "";
};
</script>
