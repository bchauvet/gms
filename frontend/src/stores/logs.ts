import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { LocalStorage } from 'quasar';
import { WclApi } from 'src/services/';

type Nullable<T> = T | null;

export const useWclStore = defineStore('wcl', () => {
  const WclToken = ref<Nullable<string>>(LocalStorage.getItem('wcl_token') || null);

  watch(
    () => WclToken.value,
    (value) => {
      console.log(value);
      LocalStorage.set('wcl_token', WclToken.value);
    },
  );

  const initStore = async () => {
    await WclApi.getToken.then((token) => (WclToken.value = token));
  };

  return {
    WclToken,
    initStore,
  };
});
