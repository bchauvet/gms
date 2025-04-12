<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRosterStore } from 'stores/roster';
import { sortBy } from 'lodash';
import {
  slotTypes,
  rankColors,
  getRankColor,
  type Character,
  type WclCharacter,
} from 'src/services';

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
];

onMounted(async () => {
  for (const name of rNames) {
    await rosterStore.getCharacter('sulfuron', name);
    await rosterStore.getCharacterLogs('sulfuron', name);
  }
});

declare interface CharacterWithLogs extends Character {
  logs?: WclCharacter['zoneRankings'];
}

const displayed_characters = computed<CharacterWithLogs[]>(() => {
  let _roster = rosterStore.characters.filter((char) => rNames.includes(char.name));
  _roster = sortBy(_roster, (char) => (char.average_item_level ? 1 / char.average_item_level : 1));
  _roster = _roster.map((c) => ({
    ...c,
    logs: rosterStore.logs.find((l) => l.name === c.name)?.zoneRankings,
  }));
  return _roster;
});

const getItemBySlot = (char_id: number, slot: string) => {
  return rosterStore.characters
    .find((c) => c.id === char_id)
    ?.equipped_items.find((eqItem) => eqItem.slot.type === slot);
};

const getItemIlvl = (char_id: number, slot: string) => {
  return getItemBySlot(char_id, slot)?.item.level || null;
};

const getItemIcon = (char_id: number, slot: string) => {
  const item = getItemBySlot(char_id, slot)?.item;
  if (item?.media.assets?.length) {
    return item.media.assets[0].value.split('/').pop();
  }
  return null;
};

const getItemGemIds = (char_id: number, slot: string) => {
  const item = getItemBySlot(char_id, slot);
  if (item?.enchantments) {
    return item.enchantments
      .filter((e) => !e.enchantment_slot?.type)
      .map((k) => k.source_item?.id)
      .filter((e) => e)
      .join(':');
  }
  return '';
};

const getItemEnchantmentIds = (char_id: number, slot: string) => {
  const item = getItemBySlot(char_id, slot);
  if (item?.enchantments) {
    return item.enchantments
      .filter((e) => e.enchantment_slot?.type)
      .map((k) => k.enchantment_id)
      .join(':');
  }
};

const colorByILVL = (ilvl: number | null) => {
  if (ilvl) {
    if (ilvl >= 410) {
      return 'bg-green-3';
    } else if (ilvl >= 397) {
      return 'bg-yellow-3';
    } else if (ilvl < 384 && ilvl > 0) {
      return 'bg-red-3';
    }
  } else {
    return '';
  }
};
</script>

<template>
  <q-markup-table dense flat bordered class="text-center" separator="cell" wrap-cells>
    <thead>
      <tr>
        <th colspan="4">Roster</th>
        <th
          v-if="rosterStore.logs.length"
          :colspan="1 + rosterStore.logs[0]!.zoneRankings.rankings.length"
        >
          Logs
        </th>
        <th colspan="17">Equipement</th>
      </tr>
      <q-tr>
        <q-th>Rang</q-th>
        <q-th>iLvL</q-th>
        <q-th>Classe</q-th>
        <q-th>Personnage</q-th>
        <q-th>Moy.</q-th>
        <q-th
          v-for="encounter in rosterStore.logs[0]?.zoneRankings.rankings.map((r) => r.encounter)"
          :key="encounter.id"
        >
          {{ encounter.name }}
        </q-th>
        <q-th v-for="slotType in slotTypes" :key="slotType">
          {{ slotType }}
        </q-th>
      </q-tr>
    </thead>
    <tbody>
      <q-tr v-for="(c, idx) in displayed_characters" :key="c.id">
        <q-td class="text-bold">
          {{ idx + 1 }}
        </q-td>
        <q-td
          :style="`color: ${idx < 1 ? rankColors.legendary : idx < 3 ? rankColors.astounding : idx < 10 ? rankColors.epic : idx < 15 ? rankColors.rare : rankColors.uncommon}`"
          class="text-bold"
          >{{ c.average_item_level }}
        </q-td>
        <q-td>
          <q-img
            v-if="c.character_class"
            width="2rem"
            :src="rosterStore.getClassIcon(c.character_class.id)"
          />
        </q-td>
        <q-td>
          {{ c.name }}
        </q-td>
        <template v-if="c.logs">
          <q-td
            class="text-bold"
            :style="'color:' + getRankColor(Math.round(c.logs.bestPerformanceAverage * 10) / 10)"
          >
            <a
              target="_blank"
              :href="`https://classic.warcraftlogs.com/character/eu/sulfuron/${c.name.toLowerCase()}?size=10`"
            >
              {{ Math.round(c.logs.bestPerformanceAverage * 10) / 10 }}
            </a>
          </q-td>
          <q-td
            v-for="encounter in rosterStore.logs[0]?.zoneRankings.rankings.map((r) => r.encounter)"
            :key="encounter.id + '-' + c.id"
            class="text-bold"
            :style="
              'color:' +
              getRankColor(
                Math.floor(
                  c.logs.rankings.find((r) => r.encounter.id === encounter.id)?.rankPercent ?? 0,
                ),
              )
            "
          >
            <a
              target="_blank"
              :href="`https://classic.warcraftlogs.com/character/eu/sulfuron/${c.name.toLowerCase()}?size=10&boss=${encounter.id}`"
            >
              {{
                Math.floor(
                  c.logs.rankings.find((r) => r.encounter.id === encounter.id)?.rankPercent ?? 0,
                )
              }}
            </a>
          </q-td>
        </template>
        <template v-else>
          <q-td />
          <q-td :colspan="rosterStore.logs[0]?.zoneRankings.rankings.length ?? 0" />
        </template>
        <q-td
          v-for="slotType in slotTypes"
          :key="slotType"
          :class="colorByILVL(getItemIlvl(c.id, slotType))"
        >
          <a
            :href="`https://www.wowhead.com/cata/item=${getItemBySlot(c.id, slotType)?.item.id}`"
            target="_blank"
            :data-wowhead="
              'gems=' +
              getItemGemIds(c.id, slotType) +
              '&ench=' +
              getItemEnchantmentIds(c.id, slotType) +
              '&pcs=' +
              getItemBySlot(c.id, slotType)
                ?.set?.items.filter((k) => k.is_equipped)
                .map((k) => k.item.id)
                .join(':')
            "
          >
            <q-img
              width="2rem"
              :src="'https://wow.zamimg.com/images/wow/icons/large/' + getItemIcon(c.id, slotType)"
            />
          </a>
        </q-td>
      </q-tr>
    </tbody>
  </q-markup-table>
</template>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
</style>
