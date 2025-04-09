import { defineStore } from 'pinia';
import { ref } from 'vue';
import { BnetAuth } from 'src/services';

export const useAuthStore = defineStore('auth', () => {
  const BnetProfile = ref();

  const initStore = async () => {
    if (BnetProfile.value) return;
    await BnetAuth.getUser().then(
      (user) => (BnetProfile.value = user),
    )
  };

  return {
    BnetProfile,
    initStore,
  };
});
