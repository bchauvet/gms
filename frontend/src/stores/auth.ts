import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { LocalStorage } from 'quasar';
import  { type BnetUser, BnetApi } from 'src/services/';

type Nullable<T> = T | null;

export const useAuthStore = defineStore('auth', () => {
  const BnetToken = ref<Nullable<string>>(LocalStorage.getItem('bnet_token') || null);
  const BnetUserInfo = ref<Nullable<BnetUser>>();

  watch(
    () => BnetToken.value,
    (value) => {
      console.log(value);
      LocalStorage.set('bnet_token', BnetToken.value);
      LocalStorage.set('bnet_user', BnetUserInfo.value);
    },
  );

  const initStore = async () => {
    await BnetApi.user.info().then((resp) => (BnetUserInfo.value = resp.data));
  }

  return {
    BnetUserInfo,
    BnetToken,
    initStore,
  };
});
