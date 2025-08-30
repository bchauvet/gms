<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { date } from 'quasar';
import { WclApi, type WclReport } from 'src/services';
import { sortBy, uniqBy } from 'lodash';

declare interface ilvlReference {
  name: string;
  ilvl: number;
  date: string;
  week: number;
}

const extractIlvls = (data: WclReport) => {
  return [
    ...data.playerDetails.data.playerDetails.tanks,
    ...data.playerDetails.data.playerDetails.dps,
    ...data.playerDetails.data.playerDetails.healers,
  ].map((p) => ({
    name: p.name,
    ilvl: p.maxItemLevel,
    date: new Date(data.startTime).toISOString(),
    week: date.getWeekOfYear(new Date(data.startTime)),
  })) as ilvlReference[];
};

const logCodes = ref<string[]>([]);
const ilvlTimestamps = ref<ilvlReference[]>([]);
const originWeek = computed(() => Math.min(...ilvlTimestamps.value.map((t) => t.week)));

onMounted(async () => {
  await WclApi.getGuildLogs('Auberdine', 'INSU').then((reports) => {
    logCodes.value = reports.map((r: WclReport) => r.code);
  });
  const promises = [];
  for (const code of logCodes.value) {
    promises.push(
      WclApi.getReport(code).then((report) => ilvlTimestamps.value.push(...extractIlvls(report))),
    );
  }
  await Promise.all(promises).then(
    () => (ilvlTimestamps.value = uniqBy(sortBy(ilvlTimestamps.value, 'ilvl').reverse(), 'name')),
  );
});
</script>

<template>
  <pre>{{ originWeek }}</pre>
  <pre>{{ logCodes }}</pre>
  <pre>{{ ilvlTimestamps[0] }}</pre>
</template>
