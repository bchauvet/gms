<script setup lang="ts">
import { type Character, charClasses } from 'src/services';
import { ref, computed } from 'vue';
import { orderBy } from 'lodash';

const characters = defineModel<Character[]>('characters', { required: true });
const members = defineModel<Character[]>('members', { required: true });

const filter = ref('');
const clsFilter = ref(
  orderBy(
    charClasses.map((c) => ({ ...c, selected: false })),
    'name',
  ),
);
const lvlFilterRange = ref({
  min: 1,
  max: 120,
});
const filteredList = computed(() => {
  const _clsFilter = clsFilter.value.filter((c) => c.selected).map((c) => c.id);
  return characters.value
    .filter(
      (c) => !_clsFilter.length || !c.playable_class || _clsFilter.includes(c.playable_class?.id),
    )
    .filter((c) => c.level >= lvlFilterRange.value.min && c.level <= lvlFilterRange.value.max);
});
</script>

<template>
  <q-table
    v-if="characters.length"
    :rows="filteredList"
    dense
    flat
    bordered
    :rows-per-page-options="[20, 30, 40, 50]"
    :pagination="{ rowsPerPage: 20 }"
    separator="cell"
    :filter="filter"
    :columns="[
      {
        name: 'name',
        label: 'Personnage',
        field: 'name',
        align: 'center',
        sortable: true,
      },
      {
        name: 'level',
        label: 'Level',
        field: 'level',
        align: 'center',
        sortable: true,
      },
      {
        name: 'character_class',
        label: 'Classe',
        field: (row) => row.playable_class?.id || row.character_class?.id,
        align: 'center',
        sortable: true,
      },
      {
        name: 'action',
        label: '',
        field: 'id',
      },
    ]"
  >
    <template v-slot:top>
      <q-input outlined dense debounce="300" color="primary" v-model="filter" clearable>
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template #header-cell-level="props">
      <q-th class="sortable">
        <span @click="props.sort(props.col.name)">{{ props.col.label }}</span>
        <q-btn-dropdown dropdown-icon="filter_alt" size="xs" flat padding="xs">
          <q-list>
            <q-item>
              <q-range
                class="q-ma-lg"
                vertical
                reverse
                lazy
                color="black"
                label-always
                switch-marker-labels-side
                :model-value="lvlFilterRange"
                :marker-labels="{ 60: '60', 70: '70', 80: '80', 85: '85', 90: '90' }"
                track-size="10px"
                drag-range
                @change="(val) => (lvlFilterRange = val)"
                :min="Math.min(...characters.map((c) => c.level))"
                :max="Math.max(...characters.map((c) => c.level))"
              />
            </q-item>
            <q-separator />
            <q-item dense>
              <q-btn dense flat label="Ok" v-close-popup />
              <q-space />
              <q-btn
                flat
                dense
                label="Reset"
                @click="
                  lvlFilterRange = {
                    min: 60,
                    max: Math.max(...characters.map((c) => c.level)),
                  }
                "
                v-close-popup
              />
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-th>
    </template>
    <template #header-cell-character_class="props">
      <q-th class="sortable">
        <span @click="props.sort(props.col.name)">{{ props.col.label }}</span>
        <q-btn-dropdown dropdown-icon="filter_alt" size="xs" flat padding="xs">
          <q-list>
            <q-item dense v-for="cls in clsFilter" :key="cls.name">
              <q-item-section side>
                <q-img width="1.5rem" :src="cls.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ cls.name }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-checkbox size="xs" v-model="cls.selected" />
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item dense>
              <q-btn dense flat label="Ok" v-close-popup />
              <q-space />
              <q-btn
                flat
                dense
                label="Reset"
                v-close-popup
                @click="
                  clsFilter = orderBy(
                    charClasses.map((c) => ({ ...c, selected: false })),
                    'name',
                  )
                "
              />
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-th>
    </template>
    <template #body-cell-character_class="props">
      <q-td class="text-center">
        <q-img
          :title="charClasses.find((c) => c.id == props.value)?.name"
          width="1.5rem"
          :src="charClasses.find((c) => c.id == props.value)?.icon"
        />
      </q-td>
    </template>
    <template #body-cell-action="props">
      <q-td class="text-center">
        <q-badge color="green" v-if="members.map((m) => m.id).includes(props.row.id)">
          Inclus
        </q-badge>
        <q-btn
          v-else
          size="sm"
          dense
          icon="add"
          flat
          padding="xs"
          @click="members.push(props.row)"
        />
      </q-td>
    </template>
  </q-table>
</template>
