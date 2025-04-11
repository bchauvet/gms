<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCharStore } from 'stores/class';
import { sortBy } from 'lodash';

const charStore = useCharStore();

const rNames = [
  'Masakek',
  'Darkstarky',
  'Medà',
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

const slotTypes = [
  'HEAD',
  'NECK',
  'SHOULDER',
  'BACK',
  'CHEST',
  'WRIST',
  'HANDS',
  'WAIST',
  'LEGS',
  'FEET',
  'FINGER_1',
  'FINGER_2',
  'TRINKET_1',
  'TRINKET_2',
  'MAIN_HAND',
  'OFF_HAND',
  'RANGED',
];

const colors = {
  legendary: '#ff8000',
  astounding: '#e268a8',
  epic: '#a335ee',
  rare: '#0070ff',
  uncommon: '#1eff00',
  common: '#666',
};

onMounted(async () => {
  for (const name of rNames) {
    await charStore.getCharacter('sulfuron', name);
  }
});

const getItemBySlot = (char_id: number, slot: string) => {
  return charStore.characters
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

const display_mode = ref('icon');
</script>

<template>
  <q-markup-table dense flat bordered class="text-center" separator="cell">
    <thead>
      <q-tr>
        <q-th>Rang</q-th>
        <q-th>iLvL</q-th>
        <q-th>Personnage</q-th>
        <q-th>Classe</q-th>
        <q-th v-for="slotType in slotTypes" :key="slotType">
          {{ slotType }}
        </q-th>
      </q-tr>
    </thead>
    <tbody>
      <q-tr
        v-for="(c, idx) in sortBy(charStore.characters, (char) =>
          char.average_item_level ? 1 / char.average_item_level : 1,
        )"
        :key="c.id"
      >
        <q-td class="text-bold">
          {{ idx + 1 }}
        </q-td>
        <q-td
          :style="`color: ${idx < 1 ? colors.legendary : idx < 3 ? colors.astounding : idx < 10 ? colors.epic : idx < 15 ? colors.rare : colors.uncommon}`"
          class="text-bold"
          >{{ c.average_item_level }}
        </q-td>
        <q-td>
          <a
            style="text-decoration: none; color: inherit"
            target="_blank"
            :href="`https://classic.warcraftlogs.com/character/eu/sulfuron/${c.name.toLowerCase()}?size=10`"
          >
            {{ c.name }}
          </a>
        </q-td>
        <q-td>
          <q-img
            v-if="c.character_class"
            width="1.5rem"
            :src="charStore.getClassIcon(c.character_class.id)"
          />
        </q-td>
        <q-td
          v-for="slotType in slotTypes"
          :key="slotType"
          :class="colorByILVL(getItemIlvl(c.id, slotType))"
        >
          <span v-if="display_mode == 'ilvl'">getItemIlvl(c.id, slotType)</span>
          <a
            v-else-if="getItemBySlot(c.id, slotType)"
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
  <pre>{{ charStore.characters[0]?.equipped_items[0]?.set }}</pre>
</template>
