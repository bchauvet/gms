<script setup lang="ts">
import { useAuthStore } from 'stores/auth';
import { useCharStore } from 'stores/class';
import { storeToRefs } from 'pinia';
import { type Character } from 'src/services';
import { ref } from 'vue';

const authStore = useAuthStore();
const charStore = useCharStore();
const { BnetAccount } = storeToRefs(authStore);

const characterDetail = ref<Character>();

const onClick = async (realm: string, name: string, force = false) => {
  characterDetail.value = await charStore.getCharacter(realm, name, force);
};
</script>

<template>
  <q-markup-table v-if="BnetAccount" square dense bordered flat class="text-center">
    <thead>
      <q-tr>
        <q-th>Serveur / Faction</q-th>
        <q-th>Personnage</q-th>
        <q-th>Level</q-th>
        <q-th>Classe</q-th>
        <q-th>Race</q-th>
        <q-th />
      </q-tr>
    </thead>
    <tbody
      v-for="char in BnetAccount.characters.filter((c: Character) => c.level > 9)"
      :key="char.id"
    >
      <q-tr>
        <q-td>{{ char.realm.name }} / {{ char.faction.name }}</q-td>
        <q-td>{{ char.name }}</q-td>
        <q-td>{{ char.level }}</q-td>
        <q-td><q-img width="1.5rem" :src="charStore.getClassIcon(char.playable_class.id)" /></q-td>
        <q-td>{{ char.playable_race.name }}</q-td>
        <q-td>
          <q-btn-group unelevated>
            <q-btn
              v-if="characterDetail?.id == char.id"
              small
              dense
              color="accent"
              icon="visibility_off"
              @click="characterDetail = undefined"
            />
            <q-btn
              v-if="characterDetail?.id != char.id"
              small
              dense
              color="primary"
              icon="visibility"
              @click="onClick(char.realm.slug, char.name)"
            />
            <q-btn
              small
              dense
              color="warning"
              icon="refresh"
              @click="onClick(char.realm.slug, char.name, true)"
            />
          </q-btn-group>
        </q-td>
      </q-tr>
      <q-tr v-if="characterDetail?.id == char.id">
        <q-td colspan="6">
          <q-markup-table flat bordered dense>
            <thead>
              <q-tr>
                <q-th>#</q-th>
                <q-th>Slot</q-th>
                <q-th>Item</q-th>
                <q-th>Level</q-th>
                <q-th>Icon</q-th>
              </q-tr>
            </thead>
            <tbody>
              <q-tr v-for="eqItem in characterDetail?.equipped_items" :key="eqItem.slot.name">
                <td>{{ eqItem.item.id }}</td>
                <td>{{ eqItem.slot.name }}</td>
                <td>{{ eqItem.name }}</td>
                <td>{{ eqItem.item.level }}</td>
                <td>
                  <a :href="`https://www.wowhead.com/cata/item=${eqItem.item.id}`" target="_blank">
                    <q-img
                      v-if="eqItem.item.media?.assets"
                      width="2rem"
                      :src="
                        'https://wow.zamimg.com/images/wow/icons/large/' +
                        eqItem.item.media.assets[0].value.split('/').pop()
                      "
                    />
                  </a>
                </td>
              </q-tr>
            </tbody>
          </q-markup-table>
        </q-td>
      </q-tr>
    </tbody>
  </q-markup-table>
</template>
