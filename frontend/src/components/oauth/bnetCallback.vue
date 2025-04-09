<script setup lang="ts">
import { BnetAuth } from 'src/services/';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useAuthStore } from 'stores/auth';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  let user = authStore.BnetProfile;
  if (!user) {
    user = (await BnetAuth.signinRedirectCallback()) || null;
  }
  authStore.BnetProfile = user;
  await router.push('/');
});
</script>

<template>
  <div></div>
</template>
