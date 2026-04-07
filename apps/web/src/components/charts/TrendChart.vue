<template>
  <VChart
    class="h-full min-h-48 w-full"
    :option="option"
    autoresize
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import VChart, { THEME_KEY } from "vue-echarts";
import { CanvasRenderer } from "echarts/renderers";
import { GridComponent, TooltipComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { use } from "echarts/core";
import { provide } from "vue";

use([CanvasRenderer, GridComponent, LineChart, TooltipComponent]);
provide(THEME_KEY, "light");

const props = withDefaults(
  defineProps<{
    labels: string[];
    values: number[];
    color?: string;
    fill?: boolean;
    max?: number;
  }>(),
  {
    color: "#1565d8",
    fill: true,
    max: undefined,
  },
);

const option = computed(() => ({
  animationDuration: 300,
  grid: {
    top: 12,
    right: 12,
    bottom: 20,
    left: 8,
    containLabel: true,
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 0,
    textStyle: { color: "#0d1a2b" },
  },
  xAxis: {
    type: "category",
    data: props.labels,
    boundaryGap: false,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: "#56708f", fontSize: 11 },
  },
  yAxis: {
    type: "value",
    max: props.max,
    splitLine: { lineStyle: { color: "rgba(95,130,189,0.12)" } },
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { show: false },
  },
  series: [
    {
      type: "line",
      smooth: true,
      showSymbol: false,
      data: props.values,
      lineStyle: { width: 3, color: props.color },
      areaStyle: props.fill ? { color: `${props.color}22` } : undefined,
    },
  ],
}));
</script>
