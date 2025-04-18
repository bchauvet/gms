<script setup lang="ts">
import { BnetIcon, BnetAuth } from 'src/services/index.js';
import { useAuthStore } from 'stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { isLoogedIn, BnetProfile } = storeToRefs(authStore);
const { Logout } = authStore;
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="row items-center justify-evenly bg-dark bg-image">
        <q-card>
          <q-card-section>
            <q-btn
              size="lg"
              unelevated
              :label="isLoogedIn ? BnetProfile?.battletag : 'Battle.net Login'"
              color="primary"
              :icon="BnetIcon"
              @click="isLoogedIn ? Logout() : BnetAuth.signinRedirect()"
            />
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.bg-image {
  background-image: url('/cata.jpg') !important;
  background-size: cover !important;
  background-position: center !important;
}
</style>
