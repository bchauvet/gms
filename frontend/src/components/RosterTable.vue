<script setup lang="ts">
import { getRankColor, rankColors, itemSlots, type Item, type Specialization } from 'src/services';
import { useRosterStore, type Roster, type CharacterWithLogs } from 'stores/roster';
import { indexOf, sortBy } from 'lodash';
import { computed } from 'vue';

const rosterStore = useRosterStore();

const roster = defineModel<Roster>('roster', { required: true });

const getItemBySlot = (char_id: number, slot: string) => {
  return roster.value.characters
    .find((c) => c.id === char_id)
    ?.equipped_items.find((eqItem) => eqItem.slot.type === slot);
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

const forceRefresh = async (realm: string, name: string) => {
  await rosterStore.getCharacter(realm, name, true);
  await rosterStore.getCharacterLogs(realm, name, true);
};

const getCharacterSpec = (char: CharacterWithLogs) => {
  let spec = null;
  if (char.specializations?.length) {
    spec = sortBy(
      char.specializations
        .find((s: Specialization) => s.is_active)
        ?.specializations.map((tree) => ({
          spec: tree.specialization_name,
          points: tree.spent_points,
        })),
      'points',
    ).pop()?.spec;
  }
  return {
    name: spec,
    icon:
      spec && !!char.character_class
        ? rosterStore.getSpecIcon(char.character_class.id, spec)
        : undefined,
  };
};

const logColumns = computed(() => {
  if (rosterStore.logs.length) {
    return [
      {
        name: 'bestPerformanceAverage',
        label: 'Moy.',
        field: (row: CharacterWithLogs) =>
          Math.floor((row.logs?.bestPerformanceAverage ?? 0) * 10) / 10,
        sortable: true,
        sortOrder: 'da' as 'da' | 'ad',
        align: 'center' as 'left' | 'right' | 'center',
      },
      ...rosterStore.logs[0]!.zoneRankings.rankings.map((r) => {
        return {
          name: r.encounter.name,
          label: r.encounter.name,
          field: (row: CharacterWithLogs) =>
            Math.floor(
              row.logs?.rankings.find((l) => l.encounter.id === r.encounter.id)?.rankPercent ?? 0,
            ),
          sortable: true,
          sortOrder: 'da' as 'da' | 'ad',
          align: 'center' as 'left' | 'right' | 'center',
        };
      }),
    ];
  } else {
    return [];
  }
});

const equipmentColumns = computed(() => {
  return itemSlots.map((slotType) => ({
    name: slotType,
    label: slotType,
    field: (row: CharacterWithLogs) => getItemBySlot(row.id, slotType)?.item,
    sortable: true,
    align: 'center' as 'left' | 'right' | 'center',
    sort: (a: Item, b: Item) => a.level! - b.level!,
    sortOrder: 'da' as 'da' | 'ad',
  }));
});

const charLogUrl = (char: CharacterWithLogs, size?: number, encounter?: number) => {
  let url = 'https://classic.warcraftlogs.com/character/eu/';
  url += char.realm.slug + '/';
  url += char.name.toLowerCase() + '/';
  url += size ? `?size=${size}` : '';
  url += encounter ? `&boss=${encounter}` : '';
  return url;
};
</script>

<template>
  <q-table
    dense
    separator="cell"
    wrap-cells
    :rows="roster.characters"
    row-key="id"
    :rows-per-page-options="[25, 50]"
    :pagination="{ rowsPerPage: 25 }"
    :columns="[
      {
        name: 'action',
        label: '',
        field: 'id',
      },
      {
        name: 'rank',
        label: 'Rang',
        field: (row) => indexOf(roster.characters, row) + 1,
        align: 'center',
      },
      {
        name: 'class',
        label: 'Classe/Spé',
        align: 'center',
        sortable: true,
        field: (row) => row.character_class.id,
      },
      {
        name: 'ilvl',
        label: 'iLvL',
        field: 'average_item_level',
        align: 'center',
        classes: 'text-bold',
        sortable: true,
        sortOrder: 'da' as 'da' | 'ad',
        style: (row) => {
          const idx = indexOf(roster.characters, row);
          return `color: ${idx < 1 ? rankColors.legendary : idx < 3 ? rankColors.astounding : idx < 10 ? rankColors.epic : idx < 15 ? rankColors.rare : rankColors.uncommon}`;
        },
      },
      {
        name: 'character_name',
        label: 'Personnage',
        field: 'name',
        sortable: true,
        align: 'center',
      },
      ...logColumns,
      ...equipmentColumns,
    ]"
  >
    <template #top="props">
      <div class="q-table__title">{{ roster.name }} (R{{ roster.raid_size }})</div>
      <q-space />
      <q-btn
        flat
        round
        dense
        :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
        @click="
          () => {
            props.toggleFullscreen();
            props.pagination.rowsPerPage = props.inFullscreen ? 10 : 25;
          }
        "
        class="q-ml-md"
      />
    </template>
    <template v-slot:top-row>
      <q-tr>
        <q-td colspan="5" class="text-center text-bold">Roster</q-td>
        <q-td
          v-if="roster.characters[0]?.logs"
          :colspan="roster.characters[0].logs.rankings.length + 1"
          class="text-center text-bold"
        >
          Warcraft Logs
        </q-td>
        <q-td colspan="17" class="text-center text-bold">Equipement</q-td>
      </q-tr>
    </template>
    <template v-slot:body-cell-action="props">
      <q-td>
        <q-btn
          flat
          padding="xs"
          icon="refresh"
          size="sm"
          @click="forceRefresh(props.row.realm.slug, props.row.name)"
        />
      </q-td>
    </template>
    <template v-slot:body-cell-class="props">
      <q-td class="text-center">
        <q-img
          v-if="props.value && getCharacterSpec(props.row).icon"
          width="2rem"
          :title="getCharacterSpec(props.row).name"
          :src="getCharacterSpec(props.row).icon"
        />
        <q-img v-else-if="props.value" width="2rem" :src="rosterStore.getClassIcon(props.value)" />
      </q-td>
    </template>
    <template v-slot:body-cell-bestPerformanceAverage="props">
      <q-td :style="'color:' + getRankColor(props.value)" class="text-bold text-center">
        <a target="_blank" :href="charLogUrl(props.row, roster.raid_size)">
          {{ props.value }}
        </a>
      </q-td>
    </template>
    <template
      v-for="encounter in roster.characters[0]?.logs?.rankings.map((r) => r.encounter)"
      :key="encounter.id"
      v-slot:[`body-cell-${encounter.name}`]="props"
    >
      <q-td class="text-center text-bold" :style="'color:' + getRankColor(props.value)">
        <a target="_blank" :href="charLogUrl(props.row, roster.raid_size, encounter.id)">
          {{ props.value }}
        </a>
      </q-td>
    </template>
    <template
      v-for="itemSlot in itemSlots"
      v-slot:[`body-cell-${itemSlot}`]="props"
      :key="itemSlot"
    >
      <q-td
        :class="
          props.value
            ? `${props.value.quality.type == 'LEGENDARY' || props.value.level >= 410 ? 'bg-green-3' : props.value.level >= 397 ? 'bg-yellow-3' : props.value.level < 384 ? 'bg-red-3' : ''}`
            : ''
        "
      >
        <div class="text-center">
          <a
            v-if="props.value"
            :href="`https://www.wowhead.com/cata/item=${props.value?.id}`"
            target="_blank"
            :data-wowhead="
              'gems=' +
              getItemGemIds(props.row.id, itemSlot) +
              '&ench=' +
              getItemEnchantmentIds(props.row.id, itemSlot) +
              '&pcs=' +
              getItemBySlot(props.row.id, itemSlot)
                ?.set?.items.filter((k) => k.is_equipped)
                .map((k) => k.item.id)
                .join(':')
            "
          >
            <q-img
              width="2rem"
              :src="
                'https://wow.zamimg.com/images/wow/icons/large/' +
                getItemIcon(props.row.id, itemSlot.replace('body-cell-', ''))
              "
            />
          </a>
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<style>
a {
  text-decoration: none;
  color: inherit;
}
th > i {
  display: none !important;
}
</style>
