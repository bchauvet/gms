<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { date, LocalStorage } from 'quasar';
import { WclApi, type WclReport } from 'src/services';
import { sortBy, uniqBy } from 'lodash';
import { Line } from 'vue-chartjs';
import { charClasses } from 'src/services';
import type { LegendItem, LegendElement, ChartEvent } from 'chart.js';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend as LegendPlugin,
  LinearScale,
  PointElement,
  LineElement,
  CategoryScale,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  LegendPlugin,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
);

declare interface ilvlReference {
  name: string;
  type: string;
  ilvl: number;
  date: string;
  week: number;
}

const extractIlvls = (report: WclReport) => {
  const tanks = report.playerDetails.data.playerDetails.tanks;
  const dps = report.playerDetails.data.playerDetails.dps;
  const healers = report.playerDetails.data.playerDetails.healers;
  return [tanks || [], healers || [], dps || []].flat().map((p) => ({
    name: p.name,
    type: p.type,
    ilvl: p.maxItemLevel,
    date: new Date(report.startTime).toISOString(),
    week: date.getWeekOfYear(new Date(report.startTime)),
  })) as ilvlReference[];
};

const logCodes = ref<string[]>([]);
const tsDB = ref<ilvlReference[]>([]);

const originWeek = computed(() => Math.min(...tsDB.value.map((t) => t.week)));
const logWeeks = computed(() =>
  uniqBy(sortBy(tsDB.value, 'week'), 'week').map((t) => t.week - originWeek.value + 1),
);

function ilvlByWeek(char: string, week: number): number | null {
  return (
    sortBy(tsDB.value, 'ilvl')
      .reverse()
      .find((t) => t.name === char && week === t.week - originWeek.value + 1)?.ilvl || null
  );
}

const characters = computed(() =>
  sortBy(
    uniqBy(tsDB.value, 'name').map((c) => ({
      name: c.name,
      class: c.type,
      color: charClasses.find((cls) => cls.name.replace(' ', '') === c.type)?.color || '#000000',
      ilvlByWeek: logWeeks.value.map((w) => ({
        x: w,
        y: ilvlByWeek(c.name, w),
      })) as { x: number; y: number }[],
    })),
    ['class', 'name'],
  ),
);

const chartData = computed(() => {
  return {
    labels: uniqBy(tsDB.value, 'week')
      .map((t) => t.week - originWeek.value + 1)
      .sort((a, b) => a - b),
    datasets: characters.value.map((c) => ({
      label: c.name,
      tension: 0.2,
      data: c.ilvlByWeek,
      borderColor: c.color === '#FFFFFF' ? '#000000' : c.color,
      backgroundColor: c.color === '#FFFFFF' ? '#000000' : c.color,
    })),
  };
});
const chartOptions = {
  responsive: true,
  scales: {
    x: {
      ticks: {
        callback: (value: number) => 'W' + (value + 1),
      },
    },
  },
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        boxWidth: 20,
        boxHeight: 2,
      },
      onClick: (event: ChartEvent, legendItem: LegendItem, legend: LegendElement<any>) => {
        const index = legendItem.datasetIndex as number;
        const ci = legend.chart;
        if (event.native?.shiftKey && index) {
          ci.getSortedVisibleDatasetMetas().forEach((meta) => (meta.hidden = true));
          ci.update();
          ci.show(index);
          legendItem.hidden = true;
        } else {
          if (ci.isDatasetVisible(index)) {
            ci.hide(index);
            legendItem.hidden = true;
          } else {
            ci.show(index);
            legendItem.hidden = false;
          }
        }
      },
    },
  },
};

onMounted(async () => {
  if (LocalStorage.getItem('tsDB')) {
    tsDB.value = LocalStorage.getItem('tsDB')!;
  } else {
    await WclApi.getGuildLogs('Auberdine', 'INSU').then((reports) => {
      logCodes.value = reports.map((r: WclReport) => r.code);
    });
    await Promise.all(logCodes.value.map(WclApi.getReport)).then((reports) => {
      tsDB.value = reports.map(extractIlvls).flat();
      LocalStorage.set('tsDB', tsDB.value);
    });
  }
});
</script>

<template>
  <Line id="ilvl-chart" :options="chartOptions" :data="chartData" />
</template>
