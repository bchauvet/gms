<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn flat dense round icon="home" :to="{ name: 'Home' }" />
        <q-toolbar-title>{{ route.meta.title ?? 'Roster Management System' }}</q-toolbar-title>
        <div>
          <q-btn
            flat
            v-if="isLoogedIn"
            :icon="BnetIcon"
            :label="BnetProfile?.battletag"
            :to="{ name: 'Profile' }"
          />
          <q-btn flat icon="logout" @click="Logout()" />
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from 'stores/auth';
import { BnetIcon } from 'src/services';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const route = useRoute();
const authStore = useAuthStore();
const { isLoogedIn, BnetProfile } = storeToRefs(authStore);
const { Logout } = authStore;

onMounted(async () => {
  await authStore.initStore();
});
</script>
