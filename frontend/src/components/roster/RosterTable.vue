<script setup lang="ts">
import { getRankColor, rankColors, itemSlots, type Item, type Specialization } from 'src/services';
import { useRosterStore, type Roster, type CharacterWithLogs } from 'stores/roster';
import { indexOf, sortBy } from 'lodash';
import { computed, ref } from 'vue';
import { charClasses } from 'src/services';
import EquippedItemIcon from 'components/EquippedItemIcon.vue';

const rosterStore = useRosterStore();

const roster = defineModel<Roster>('roster', { required: true });
const displayOffhand = ref(false);

const getItemBySlot = (char_id: number, slot: string) => {
  return roster.value.characters
    .find((c) => c.id === char_id)
    ?.equipped_items.find((eqItem) => eqItem.slot.type === slot);
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
        ?.specializations?.map((tree) => ({
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

const encounterList = computed(() => {
  const _rankings = roster.value.characters.find((c) => c.logs)?.logs?.rankings;
  return _rankings ? _rankings.map((r) => r.encounter) : [];
});

const logColumns = computed(() => {
  if (encounterList.value.length) {
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
      ...encounterList.value.map((e) => {
        return {
          name: e.name,
          label: e.name,
          field: (row: CharacterWithLogs) =>
            Math.floor(row.logs?.rankings.find((l) => l.encounter.id === e.id)?.rankPercent ?? 0),
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
  return itemSlots
    .filter((s) => displayOffhand.value || !['OFF_HAND', 'RANGED'].includes(s))
    .map((slotType) => ({
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

function removeZerosAfterLastPositive(arr: number[]) {
  if (arr.some((v) => v > 0)) {
    let lastPositiveIndex = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]! > 0) {
        lastPositiveIndex = i;
      }
    }
    return arr.slice(0, lastPositiveIndex + 1);
  } else {
    return [];
  }
}

function cleanSpellName(spell_name: string) {
  const _result = spell_name
    .replaceAll(' ', '-')
    .replaceAll("'", '')
    .replaceAll(':', '')
    .replaceAll('!', '')
    .replaceAll('.', '-')
    .replaceAll('--', '-')
    .toLowerCase();
  return _result.endsWith('-') ? _result.slice(0, -1) : _result;
}

const ctcUrl = (char: CharacterWithLogs) => {
  const _charTalent = char.specializations
    .find((s) => s.is_active)
    ?.specializations.map((spe) =>
      spe.talents.map((t) => ({
        spell: cleanSpellName(t.spell_tooltip.spell.name),
        points: t.talent_rank,
      })),
    )
    .flat();
  const _talentStr = charClasses
    .find((cls) => cls.id === char?.character_class?.id)
    ?.specializations.map((s) =>
      removeZerosAfterLastPositive(
        sortBy(s.talents, ['row', 'col']).map(
          (t) => _charTalent?.find((k) => k.spell === t.name)?.points || 0,
        ),
      ).join(''),
    )
    .join('-');
  const _className = char.character_class?.name.toLowerCase().replaceAll(' ', '-');
  return `https://cata.wowhead.com/talent-calc/${_className}/${_talentStr}`;
};

const getCharTalentBreakDown = (char: CharacterWithLogs) => {
  const _charTalent = char.specializations
    .find((s) => s.is_active)
    ?.specializations.map((spe) =>
      spe.talents.map((t) => ({
        spell: cleanSpellName(t.spell_tooltip.spell.name),
        points: t.talent_rank,
      })),
    )
    .flat();
  return charClasses
    .find((cls) => cls.id === char?.character_class?.id)
    ?.specializations.map((s) =>
      sortBy(s.talents, ['row', 'col'])
        .map((t) => _charTalent?.find((k) => k.spell === t.name)?.points || 0)
        .reduce((acc, cur) => acc + cur, 0),
    )
    .join('/');
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
        name: 'class',
        label: 'Classe/Spé',
        align: 'center',
        sortable: true,
        sort: (a, b, rowA, rowB) =>
          getCharacterSpec(rowA)?.name?.localeCompare(getCharacterSpec(rowB)?.name!) || 0,
        field: (row) => row.character_class.id,
      },
      {
        name: 'ilvl',
        label: 'iLvL',
        field: (row) =>
          `${row.equipped_item_level} ${row.average_item_level !== row.equipped_item_level ? '(' + row.average_item_level + ')' : ''}`,
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
      <div class="q-table__title text-bold">
        {{ roster.name }} | {{ roster.characters.length }} |
        {{
          Math.round(
            (roster.characters
              .map((c) => c.equipped_item_level || 0)
              .reduce((acc, cur) => acc + cur, 0) *
              10) /
              roster.characters.length,
          ) / 10
        }}
      </div>
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
    <template v-slot:header="props">
      <q-tr>
        <q-th colspan="4" class="text-center text-bold">Roster</q-th>
        <q-th
          v-if="encounterList.length"
          :colspan="encounterList.length + 1"
          class="text-center text-bold"
        >
          Warcraft Logs (R{{ roster.raid_size }})
        </q-th>
        <q-th :colspan="equipmentColumns.length" class="text-center text-bold">
          Equipement
          <q-toggle v-model="displayOffhand" />
        </q-th>
      </q-tr>
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
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
        <a
          v-if="props.value && getCharacterSpec(props.row).icon"
          :href="ctcUrl(props.row)"
          target="_blank"
        >
          <q-img
            width="2rem"
            :title="getCharacterSpec(props.row).name"
            :src="getCharacterSpec(props.row).icon"
          />
          <span style="font-size: 0.8rem"><br />{{ getCharTalentBreakDown(props.row) }}</span>
        </a>
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
      v-for="encounter in encounterList"
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
          <EquippedItemIcon v-if="props.value" :item="getItemBySlot(props.row.id, itemSlot)!" />
        </div>
      </q-td>
    </template>
    <template #bottom-row>
      <q-tr>
        <q-td colspan="100%"></q-td>
      </q-tr>
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

.q-table th {
  font-size: inherit;
}
.q-table tbody td {
  font-size: inherit;
}

.q-table--dense .q-table td {
  padding: 2px;
}
</style>
