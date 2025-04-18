<script setup lang="ts">
import { BnetAuth, type BnetUser } from 'src/services/';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useAuthStore } from 'stores/auth';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  try {
    const user = await BnetAuth.signinCallback() as BnetUser;
    if (user) {
      authStore.setUpBnetUser(user);
      await router.push({ name: 'Home' });
    } else {
      authStore.clearUserSession();
      await router.push({ name: 'Login' });
    }
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div>Authentification CallBack</div>
</template>
