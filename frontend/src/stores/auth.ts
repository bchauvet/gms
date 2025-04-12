import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { LocalStorage } from 'quasar';
import { type BnetUser, BnetApi, WclApi } from 'src/services/';

type Nullable<T> = T | null;

export const useAuthStore = defineStore('auth', () => {
  const BnetToken = ref<Nullable<string>>(LocalStorage.getItem('bnet_token') || null);
  const BnetUserInfo = ref<Nullable<BnetUser>>(LocalStorage.getItem('bnet_user') || null);
  const BnetAccount = ref();
  const WclToken = ref<Nullable<string>>(LocalStorage.getItem('wcl_token') || null);

  watch(
    () => BnetToken.value,
    () => {
      LocalStorage.set('bnet_token', BnetToken.value);
      LocalStorage.set('bnet_user', BnetUserInfo.value);
    },
  );

  watch(
    () => WclToken.value,
    (value) => {
      LocalStorage.set('wcl_token', value);
    },
  );

  const initStore = async () => {
    await BnetApi.user.info().then((resp) => (BnetUserInfo.value = resp.data));
    await BnetApi.user.accounts().then((resp) => (BnetAccount.value = resp.data.wow_accounts[0]));
    await WclApi.getToken.then((token) => (WclToken.value = token));
  };

  return {
    BnetUserInfo,
    BnetToken,
    BnetAccount,
    WclToken,
    initStore,
  };
});
