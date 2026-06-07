<template>
  <button
    v-if="patientId"
    class="theme-accent-bg fixed z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl"
    :style="{ left: `${position.x}px`, top: `${position.y}px` }"
    type="button"
    @pointerdown="handlePointerDown"
  >
    <MessageCircle :size="22" />
  </button>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, watch } from "vue";
import { MessageCircle } from "lucide-vue-next";

import { useChatStore } from "@/stores/chat";

const props = defineProps<{
  patientId: string;
  title: string;
}>();

const STORAGE_KEY = "asclepius-patient-chat-position";
const chatStore = useChatStore();
const position = reactive({ x: 0, y: 0 });

let dragging = false;
let moved = false;
let offsetX = 0;
let offsetY = 0;

const clampPosition = (x: number, y: number) => {
  const maxX = Math.max(window.innerWidth - 56, 16);
  const maxY = Math.max(window.innerHeight - 56, 16);
  return {
    x: Math.min(Math.max(16, x), maxX),
    y: Math.min(Math.max(16, y), maxY),
  };
};

const savePosition = () => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: position.x, y: position.y }));
};

const loadPosition = () => {
  const fallback = { x: Math.max(window.innerWidth - 80, 16), y: Math.max(window.innerHeight - 120, 16) };
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    Object.assign(position, fallback);
    return;
  }
  try {
    const parsed = JSON.parse(raw) as { x?: number; y?: number };
    Object.assign(position, clampPosition(parsed.x ?? fallback.x, parsed.y ?? fallback.y));
  } catch {
    Object.assign(position, fallback);
  }
};

const handlePointerMove = (event: PointerEvent) => {
  if (!dragging) {
    return;
  }
  moved = true;
  Object.assign(position, clampPosition(event.clientX - offsetX, event.clientY - offsetY));
};

const handlePointerUp = async () => {
  if (!dragging) {
    return;
  }
  dragging = false;
  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("pointerup", handlePointerUp);
  savePosition();

  if (!moved) {
    await chatStore.openThread(props.patientId, props.title);
  }
};

const handlePointerDown = (event: PointerEvent) => {
  dragging = true;
  moved = false;
  offsetX = event.clientX - position.x;
  offsetY = event.clientY - position.y;
  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", handlePointerUp);
};

const handleResize = () => {
  Object.assign(position, clampPosition(position.x, position.y));
  savePosition();
};

watch(
  () => props.patientId,
  () => {
    if (typeof window !== "undefined") {
      loadPosition();
    }
  },
);

onMounted(() => {
  loadPosition();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("pointerup", handlePointerUp);
});
</script>
