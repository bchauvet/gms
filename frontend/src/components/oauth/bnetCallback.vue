<script setup lang="ts">
import { BnetAuth } from 'src/services/';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useAuthStore } from 'stores/auth';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  if (!authStore.BnetToken) {
    const user = (await BnetAuth.signinRedirectCallback()) || null;
    authStore.$patch({ BnetToken: user.access_token });
  }
  await router.push('/');
});
</script>

<template>
  <div></div>
</template>
