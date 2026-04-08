<template>
  <div class="rounded-[1.75rem] border border-slate-100 bg-slate-50 p-4">
    <div
      v-if="!document"
      class="rounded-[1.5rem] border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500"
    >
      Upload a PDF or DOCX document to preview the surgery plan here.
    </div>
    <div v-else>
      <div class="mb-4 flex items-center justify-between gap-3 rounded-[1.25rem] bg-white px-4 py-3">
        <div>
          <p class="font-semibold text-slate-900">{{ document.name }}</p>
          <p class="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{{ document.format }}</p>
        </div>
      </div>
      <div
        ref="viewerRoot"
        class="max-h-[28rem] overflow-auto rounded-[1.5rem] bg-white p-4"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { renderAsync } from "docx-preview";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import { nextTick, ref, watch } from "vue";

import type { SurgeryPlanDocument } from "@/types/domain";

GlobalWorkerOptions.workerSrc = pdfWorker;

const props = defineProps<{
  document: SurgeryPlanDocument | null;
}>();

const viewerRoot = ref<HTMLDivElement | null>(null);

const dataUrlToUint8Array = (dataUrl: string) => {
  const base64 = dataUrl.split(",")[1] ?? dataUrl;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
};

const clearViewer = () => {
  if (viewerRoot.value) {
    viewerRoot.value.innerHTML = "";
  }
};

const renderPdf = async (data: string) => {
  if (!viewerRoot.value) {
    return;
  }

  const pdf = await getDocument({ data: dataUrlToUint8Array(data) }).promise;
  clearViewer();

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.15 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      continue;
    }
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.className = "mb-4 w-full rounded-2xl border border-slate-100";
    await page.render({ canvasContext: context, viewport }).promise;
    viewerRoot.value.appendChild(canvas);
  }
};

const renderDocx = async (data: string) => {
  if (!viewerRoot.value) {
    return;
  }

  clearViewer();
  await renderAsync(dataUrlToUint8Array(data).buffer, viewerRoot.value, undefined, {
    className: "docx-preview",
    inWrapper: false,
  });
};

watch(
  () => props.document,
  async (value) => {
    await nextTick();
    if (!value) {
      clearViewer();
      return;
    }

    if (!value.data) {
      clearViewer();
      return;
    }

    if (value.format === "pdf") {
      await renderPdf(value.data);
      return;
    }

    await renderDocx(value.data);
  },
  { immediate: true },
);
</script>
