<template>
  <q-page class="row items-center justify-evenly">
    <q-card>
      <q-card-section>
        <div class="text-h6"><q-icon size="2.5rem" :name="BnetIcon" /> Chercher un personnage</div>
      </q-card-section>
      <q-card-section>
        <q-select
          disable
          input-debounce="500"
          outlined
          dense
          options-dense
          :options="regionOptions"
          v-model="region"
        />
        <q-select
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
        <q-input
          debounce="1000"
          outlined
          dense
          v-model="char"
          placeholder="Personnage"
          :error="error"
        />
        <q-markup-table
          v-if="result.length"
          flat
          dense
          bordered
          separator="cell"
          class="text-center"
          wrap-cells
        >
          <thead>
            <q-tr>
              <q-th>Personnage</q-th>
              <q-th>Level</q-th>
              <q-th>Classe</q-th>
              <q-th>iLvL</q-th>
              <q-th>Guilde</q-th>
              <q-th></q-th>
            </q-tr>
          </thead>
          <tbody>
            <q-tr v-for="c in result" :key="c.id">
              <q-td>{{ c.name }}</q-td>
              <q-td>{{ c.level }}</q-td>
              <q-td>{{ c.character_class?.name }}</q-td>
              <q-td>{{ c.average_item_level }}</q-td>
              <q-td>{{ c.guild?.name }}</q-td>
              <q-td>
                <q-btn size="small" dense icon="add" flat label="Ajouter" />
              </q-td>
            </q-tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
    <q-card flat v-if="guildStore.guild">
      <q-card-section class="text-center">
        <div class="text-h6">&lt;{{ guildStore.guild.name }}&gt;</div>
        <div class="text-subtitle2">{{ guildStore.guild.realm.name }}</div>
      </q-card-section>
      <q-markup-table dense flat bordered>
        <thead>
          <q-tr>
            <q-th>Rang</q-th>
            <q-th>Personnage</q-th>
            <q-th>Classe</q-th>
            <q-th>Race</q-th>
          </q-tr>
        </thead>
        <tbody>
          <q-tr v-for="(m, idx) in guildStore.members.filter((m) => m.rank < 3)" :key="idx">
            <q-td>{{ m.rank + 1 }}</q-td>
            <q-td>{{ m.character.name }}</q-td>
            <q-td>
              <q-img
                width="1.5rem"
                :src="rosterStore.getClassIcon(m.character.playable_class.id)"
              />
            </q-td>
            <q-td>{{ m.character.playable_race.id }}</q-td>
          </q-tr>
        </tbody>
      </q-markup-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRosterStore } from 'stores/roster';
import { useGuildStore } from 'stores/guild';
import { BnetApi, BnetIcon, type Character, type Realm } from 'src/services';

const rosterStore = useRosterStore();
const guildStore = useGuildStore();

const regionOptions = [
  { label: 'Classic Europe', namespace: 'classic-eu', id: 43 },
  { label: 'Classic North America', namespace: 'classic-us', id: 41 },
];
const region = ref(regionOptions[0]);

const realm = ref();
const realmOptions = ref<Realm[]>([]);
const char = ref('');

const result = ref<Character[]>([]);
const error = ref(false);

onMounted(async () => {
  await guildStore.initStore();
  realmOptions.value = await BnetApi.realm.list(region.value!.namespace);
  realm.value = realmOptions.value.find((r) => r.slug === 'sulfuron');
});

watch(
  () => region.value?.namespace,
  async (value) => {
    if (value) realmOptions.value = await BnetApi.realm.list(value);
  },
);

watch(
  () => char.value,
  async (value) => {
    if (value) {
      error.value = false;
      await BnetApi.character
        .get(realm.value!.slug, value)
        .then((resp) => result.value.push(resp.data))
        .catch(() => {
          error.value = true;
          result.value = [];
        });
    }
  },
);
</script>
