<template>
  <VChart
    autoresize
    class="h-full min-h-56 w-full"
    :option="option"
  />
</template>

<script setup lang="ts">
import { computed, provide } from "vue";
import VChart, { THEME_KEY } from "vue-echarts";
import { CanvasRenderer } from "echarts/renderers";
import { GridComponent, TooltipComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { use } from "echarts/core";

import type { ComplianceSeries } from "@/types/domain";

use([CanvasRenderer, GridComponent, LineChart, TooltipComponent]);
provide(THEME_KEY, "light");

const props = defineProps<{
  series: ComplianceSeries[];
}>();

const option = computed(() => ({
  animationDuration: 400,
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 0,
    textStyle: { color: "#0f172a" },
  },
  grid: {
    top: 16,
    right: 20,
    bottom: 12,
    left: 12,
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: props.series[0]?.labels ?? [],
    boundaryGap: false,
    axisTick: { show: false },
    axisLine: { show: false },
    axisLabel: { color: "#64748b", fontSize: 11 },
  },
  yAxis: {
    type: "value",
    max: 100,
    axisLabel: { show: false },
    axisTick: { show: false },
    axisLine: { show: false },
    splitLine: { lineStyle: { color: "rgba(148,163,184,0.16)" } },
  },
  series: props.series.map((item) => ({
    name: item.name,
    type: "line",
    smooth: true,
    showSymbol: true,
    symbolSize: 7,
    data: item.values,
    lineStyle: { width: 3, color: item.color },
    itemStyle: { color: item.color },
  })),
}));
</script>
