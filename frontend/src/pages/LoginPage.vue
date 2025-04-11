<script setup lang="ts">
import { BnetAuth, BnetIcon } from 'src/services/index.js';
import { useAuthStore } from 'stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { BnetToken } = storeToRefs(authStore);
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="row items-center justify-evenly bg-dark">
        <q-card>
          <q-card-section>
            <q-btn
              v-if="!BnetToken"
              size="lg"
              unelevated
              label="Login"
              color="primary"
              :icon="BnetIcon"
              @click="BnetAuth.signinRedirect()"
            />
          </q-card-section>
        </q-card>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>
