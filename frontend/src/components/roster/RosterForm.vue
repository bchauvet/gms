<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { BnetApi, BnetIcon, type Character, type Member, type Realm } from 'src/services';
import { sortBy } from 'lodash';
import CharacterList from 'components/CharacterList.vue';

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

const members = defineModel<Character[]>('members', { required: true });

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
              resp.data.members.map((m: Member) => m.character),
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
      <CharacterList :characters="results" :members="members" />
    </q-card-section>
  </q-card>
</template>
