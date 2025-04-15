<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import {
  BnetApi,
  BnetIcon,
  type Character,
  type Member,
  type Realm,
  charClasses,
} from 'src/services';
import { sortBy } from 'lodash';

const regionOptions = [
  { label: 'Classic Europe', namespace: 'classic-eu', id: 43 },
  { label: 'Classic North America', namespace: 'classic-us', id: 41 },
];
const region = ref(regionOptions[0]);
const realm = ref();
const realmOptions = ref<Realm[]>([]);
const char = ref('');
const guild = ref('');
const results = ref<Character[]>([]);
const error = ref(false);

defineModel<Character[]>('members', { required: true });

onMounted(async () => {
  realmOptions.value = await BnetApi.realm.list(region.value!.namespace);
  realmOptions.value = realmOptions.value.filter((r) => !RegExp(/\d/).test(r.slug));
  realm.value = realmOptions.value.find((r) => r.slug === 'sulfuron');
});

watch(
  () => region.value?.namespace,
  async (value) => {
    if (value) {
      realmOptions.value = await BnetApi.realm.list(value);
      realmOptions.value = realmOptions.value.filter((r) => !RegExp(/\d/).test(r.slug));
    }
  },
);

watch(
  () => char.value,
  async (value) => {
    if (value) {
      error.value = false;
      await BnetApi.character
        .get(realm.value!.slug, value)
        .then((resp) => (results.value = [resp.data]))
        .catch(() => {
          error.value = true;
          results.value = [];
        });
    }
  },
);

watch(
  () => guild.value,
  async (value) => {
    if (value) {
      error.value = false;
      await BnetApi.guild
        .roster(realm.value.slug, value)
        .then(
          (resp) =>
            (results.value = sortBy(
              resp.data.members
                .map((m: Member) => m.character)
                .filter((c: Member['character']) => c.level >= 80),
              'level',
            ).reverse()),
        )
        .catch(() => {
          error.value = true;
          results.value = [];
        });
    }
  },
);
</script>

<template>
  <q-card>
    <q-card-section>
      <div class="text-h6"><q-icon size="2.5rem" :name="BnetIcon" class="q-mr-md" />Recherche</div>
    </q-card-section>
    <q-card-section>
      <q-select
        label="Région"
        input-debounce="500"
        outlined
        dense
        options-dense
        :options="regionOptions"
        v-model="region"
      />
      <q-select
        label="Serveur"
        outlined
        dense
        v-model="realm"
        options-dense
        :option-label="(item) => item.name.en_GB"
        :options="realmOptions"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>{{ scope.opt.name.en_GB }}</q-item-label>
              <q-item-label caption>{{ scope.opt.region.name.en_GB }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <div class="row">
        <q-input
          label="Guilde"
          debounce="1000"
          outlined
          dense
          v-model="guild"
          placeholder="Guilde"
          :error="error"
          style="width: 50%"
        />
        <q-input
          label="Personnage"
          debounce="1000"
          outlined
          dense
          v-model="char"
          placeholder="Personnage"
          :error="error"
          style="width: 50%"
        />
      </div>
      <q-table
        v-if="results.length"
        :rows="results"
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
            <q-badge color="green" v-if="members.map((m) => m.id).includes(props.row.id)">Inclus</q-badge>
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
    </q-card-section>
  </q-card>
</template>
