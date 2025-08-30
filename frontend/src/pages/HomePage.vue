<template>
  <q-page class="row items-center justify-evenly">
    <RosterForm :members="rosterMembers" />
    <q-card>
      <q-card-section class="text-center">
        <div class="text-h6">{{ rosterName }}</div>
        <div class="text-subtitle2">R{{ rosterRaidSize }}</div>
      </q-card-section>
      <q-card-section>
        <q-table
          fullscreen
          v-if="rosterMembers.length"
          :rows="rosterMembers"
          dense
          flat
          bordered
          :rows-per-page-options="[20, 30, 40, 50]"
          :pagination="{ rowsPerPage: 20 }"
          separator="cell"
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
          <template #body-cell-character_class="props">
            <q-td class="text-center">
              <q-img width="1.5rem" :src="charClasses.find((c) => c.id == props.value)?.icon" />
            </q-td>
          </template>
          <template #body-cell-action="props">
            <q-td class="text-center">
              <q-btn
                size="xs"
                dense
                color="red"
                unelevated
                icon="remove"
                padding="xs"
                @click="rosterMembers = rosterMembers.filter((m) => m.id != props.row.id)"
              />
            </q-td>
          </template>
          <template #bottom-row>
            <q-tr>
              <q-td colspan="100%" class="text-center">
                <q-btn
                  v-if="rosterMembers.length"
                  size="sm"
                  dense
                  color="primary"
                  target="_blank"
                  :to="{
                    name: 'Roster',
                    query: {
                      server: rosterMembers[0]?.realm.slug,
                      char: rosterMembers.map((m) => m.name).join(','),
                    },
                  }"
                >
                  Voir le roster
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <IlvlGraph />
  </q-page>
</template>

<script setup lang="ts">
import RosterForm from 'components/roster/RosterForm.vue';
import { type Character, charClasses } from 'src/services';
import { ref } from 'vue';
import IlvlGraph from 'components/ilvlGraph.vue';

const rosterName = ref('Nouveau roster');
const rosterRaidSize = ref(10);
const rosterMembers = ref<Character[]>([]);
</script>
