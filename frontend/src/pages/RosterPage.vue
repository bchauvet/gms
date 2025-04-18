<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRosterStore, type CharacterWithLogs } from 'stores/roster';
import { sortBy } from 'lodash';
import RosterTable from 'components/roster/RosterTable.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const rosterStore = useRosterStore();

const charNames = ref<string[]>(
  (route.query.char as string)?.split(',') || [
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
    'Lightstarky',
  ],
);
const size = ref(
  route.query.size && [10, 25].includes(Number(route.query.size)) ? Number(route.query.size) : 10,
);
const server_slug = ref((route.query.server as string) || 'sulfuron');
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
  return _roster;
});
</script>

<template>
  <RosterTable :roster="{ name: rosterName, raid_size: size, characters: displayed_characters }" />
</template>
