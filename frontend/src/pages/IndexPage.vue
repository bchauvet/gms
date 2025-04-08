<template>
  <q-page class="row items-center justify-evenly">
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
              <q-img width="1.5rem" :src="charStore.getClassIcon(m.character.playable_class.id)" />
            </q-td>
            <q-td>{{ m.character.playable_race.id }}</q-td>
          </q-tr>
        </tbody>
      </q-markup-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCharStore } from 'stores/class';
import { useGuildStore } from 'stores/guild';
import { api } from 'src/services/blizzardApi';

const charStore = useCharStore();
const guildStore = useGuildStore();

onMounted(async () => {
  await charStore.initStore();
  await guildStore.initStore();
  await api.class.list();
});
</script>
