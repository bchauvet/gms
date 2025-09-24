<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { type CharacterWithLogs, useRosterStore } from 'stores/roster';
import { sortBy, uniqBy } from 'lodash';
import RosterTable from 'components/roster/RosterTable.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const rosterStore = useRosterStore();

const charNames = ref<string[]>(
  (route.query.char as string)?.split(',') || [
    'Astarky',
    'Azaløl',
    'Charlenriz',
    'Føxdust',
    'Diwpal',
    'Jrmoug',
    'Alataré',
    'Medaladin',
    'Harkanoss',
    'Razaquel',
    'Masakek',
    'Palatare',
    'Diwood',
    'Broxîg',
    'Ohlly',
    'Medamonk',
  ],
);
const size = ref(
  route.query.size && [10, 25].includes(Number(route.query.size)) ? Number(route.query.size) : 10,
);
const server_slug = ref((route.query.server as string) || 'auberdine');
const rosterName = ref((route.query.name as string) || 'INSU');

onMounted(async () => {
  for (const name of charNames.value) {
    await rosterStore.getCharacter(server_slug.value, name);
    await rosterStore.getCharacterLogs(server_slug.value, name);
  }
});

const displayed_characters = computed<CharacterWithLogs[]>(() => {
  let _roster = rosterStore.characters.filter((char) => charNames.value.includes(char.name));
  _roster = sortBy(_roster, (char) => (char.average_item_level ? 1 / char.average_item_level : 1));
  _roster = _roster.map((c) => ({
    ...c,
    logs: rosterStore.logs.length
      ? rosterStore.logs.find((l) => l.name === c.name)?.zoneRankings
      : [],
  }));
  return uniqBy(_roster, 'id');
});
</script>

<template>
  <RosterTable :roster="{ name: rosterName, raid_size: size, characters: displayed_characters }" />
  <div class="text-center q-pa-lg">
    <q-btn
      color="secondary"
      label="Roster MOP"
      class="q-ml-lg"
      :href="
        '?server=auberdine&char=' +
        [
          'Astarky',
          'Azaløl',
          'Charlenriz',
          'Føxdust',
          'Diwpal',
          'Jrmoug',
          'Alataré',
          'Medaladin',
          'Harkanoss',
          'Razaquel',
          'Masakek',
          'Broxîg',
          'Ohlly',
          'Øhlly'
        ].join(',')
      "
    />
    <q-btn
      color="secondary"
      label="Roster YQF"
      class="q-ml-lg"
      :href="
        '?server=auberdine&char=' +
        [
          'Ttpz',
          'Wazaabtw',
          'Logõsh',
          'Cärm',
          'Modimort',
          'Sneekx',
          'Touquy',
          'Mandalozå',
          'Jrmz',
        ].join(',')
      "
    />
    <q-btn
      color="secondary"
      label="R25"
      class="q-ml-lg"
      :href="
        '?server=auberdine&size=25&char=' +
        [
          'Astarky',
          'Beadk',
          'Medaladin',
          'Azaløl',
          'Lajackett',

          'Modimort',
          'Fölïa',
          'Logõsh',
          'Jrmoug',
          'Warpampa',

          'Vokä',
          'Hunsters',
          'Cärm',
          'Føxdust',
          'Jrmz',

          'Wazaabtw',
          'Alataré',
          'Charlenriz',
          'Touquy',
          'Ttpxy',

          'Diwpal',
          'Mandalozå',
          'Gifflesun',
          'Broxîg',
          'Jokolet'
        ].join(',')
      "
    />
  </div>
</template>
