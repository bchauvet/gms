<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRosterStore, type CharacterWithLogs } from 'stores/roster';
import { sortBy } from 'lodash';
import RosterTable from 'components/RosterTable.vue';

const rosterStore = useRosterStore();

const rNames = [
  'Masakek',
  'Darkstarky',
  'Medà',
  'Médà',
  'Hykø',
  'Azzallée',
  'Diwood',
  'Jrmoug',
  'Jrmoux',
  'Palatare',
  'Razaquel',
  'Óhlly',
  'Alatare',
  'Azestra',
  'Biltouilleuh',
  'Daronneaza',
  'Føxdust',
  'Méda',
  'Hølly',
  'Slianedk',
  'Gayolas',
  'Wÿreez',
  'Medadk',
  'Medawar',
  'Lightstarky'
];

onMounted(async () => {
  for (const name of rNames) {
    await rosterStore.getCharacter('sulfuron', name);
    await rosterStore.getCharacterLogs('sulfuron', name);
  }
});

const displayed_characters = computed<CharacterWithLogs[]>(() => {
  let _roster = rosterStore.characters.filter((char) => rNames.includes(char.name));
  _roster = sortBy(_roster, (char) => (char.average_item_level ? 1 / char.average_item_level : 1));
  _roster = _roster.map((c) => ({
    ...c,
    logs: rosterStore.logs.find((l) => l.name === c.name)?.zoneRankings,
  }));
  return _roster;
});
</script>

<template>
  <RosterTable :roster="{ name: 'INSU', raid_size: 10, characters: displayed_characters }" />
</template>
