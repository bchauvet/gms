<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn flat dense round icon="home" :to="{ name: 'Home' }" />
        <q-toolbar-title>{{ route.meta.title ?? 'Roster Management System' }}</q-toolbar-title>
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
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from 'stores/auth';
import { BnetIcon } from 'src/services';
import { useRoute } from 'vue-router';

const route = useRoute();
const authStore = useAuthStore();

onMounted(async () => {
  await authStore.initStore();
});
</script>
