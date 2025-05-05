<script setup lang="ts">
import { BnetAuth, type BnetUser } from 'src/services/';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useAuthStore } from 'stores/auth';
import { LocalStorage } from 'quasar';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  try {
    const user = (await BnetAuth.signinCallback()) as BnetUser;
    if (user) {
      authStore.setUpBnetUser(user);
      const _redirect = LocalStorage.getItem('rms:redirect') as string;
      if (_redirect) {
        LocalStorage.removeItem('rms:redirect');
        await router.push(_redirect);
      } else {
        await router.push({ name: 'Home' });
      }
    } else {
      await authStore.clearUserSession();
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
