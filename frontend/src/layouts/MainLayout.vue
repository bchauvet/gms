<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>Roster Overview</q-toolbar-title>
        <div>
          <q-btn
            flat
            v-if="authStore.BnetUserInfo"
            :icon="BnetIcon"
            :label="authStore.BnetUserInfo.battletag"
            :to="{ name: 'Profile' }"
          />
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" bordered> </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from 'stores/auth';
import { useCharStore } from 'stores/class';
import { BnetIcon } from 'src/services';

const authStore = useAuthStore();
const charStore = useCharStore();
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

onMounted(async () => {
  await authStore.initStore();
  await charStore.initStore();
});
</script>
