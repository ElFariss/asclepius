<template>
  <VChart
    autoresize
    class="h-14 w-full"
    :option="option"
  />
</template>

<script setup lang="ts">
import { computed, provide } from "vue";
import VChart, { THEME_KEY } from "vue-echarts";
import { CanvasRenderer } from "echarts/renderers";
import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { use } from "echarts/core";

use([CanvasRenderer, GridComponent, LineChart]);
provide(THEME_KEY, "light");

const props = withDefaults(
  defineProps<{
    values: number[];
    color?: string;
  }>(),
  {
    color: "var(--theme-primary)",
  },
);

const option = computed(() => ({
  animationDuration: 250,
  grid: { top: 4, right: 0, bottom: 4, left: 0 },
  xAxis: { type: "category", show: false, data: props.values.map((_, index) => index) },
  yAxis: { type: "value", show: false },
  series: [
    {
      type: "line",
      smooth: true,
      showSymbol: false,
      data: props.values,
      lineStyle: { width: 2.5, color: props.color },
      areaStyle: { color: "rgba(37,99,235,0.08)" },
    },
  ],
}));
</script>
