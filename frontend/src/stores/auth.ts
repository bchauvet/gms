import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, watch, computed } from 'vue';
import { LocalStorage } from 'quasar';
import { type BnetUser, BnetApi, WclApi, BnetAuth } from 'src/services/';
import { useRouter } from 'vue-router';

type Nullable<T> = T | null;

export const useAuthStore = defineStore('auth', () => {
  const isLoogedIn = computed(() => !!BnetAuthUser.value);
  const WclToken = ref<Nullable<string>>(LocalStorage.getItem('wcl_token') || null);
  const BnetAuthUser = ref<BnetUser | null>(null);
  const BnetToken = computed(() => BnetAuthUser.value?.access_token ?? '');
  const BnetProfile = computed(() => BnetAuthUser.value?.profile ?? null);
  const BnetAccount = ref();
  const router = useRouter();

  const setUpBnetUser = (user: BnetUser) => {
    BnetAuthUser.value = user;
  };
  const clearUserSession = () => {
    BnetAuthUser.value = null;
  };
  const Logout = async () => {
    try {
      clearUserSession();
      await router.push({ name: 'Login' });
    } catch (error) {
      console.log(error);
    }
  };

  watch(
    () => WclToken.value,
    (value) => LocalStorage.set('wcl_token', value),
  );

  watch(
    () => BnetAuthUser.value,
    async () => {
      if (isLoogedIn.value) {
        console.log("Fetching Bnet Accounts")
        await BnetApi.user
          .accounts()
          .then((resp) => (BnetAccount.value = resp.data.wow_accounts[0]));
      }
    },
  );

  const initStore = async () => {
    console.log("Init Store", BnetAuthUser.value)
    await WclApi.getToken.then((token) => (WclToken.value = token));
  };

  return {
    isLoogedIn,
    BnetAuth,
    BnetToken,
    BnetProfile,
    BnetAccount,
    WclToken,
    initStore,
    setUpBnetUser,
    clearUserSession,
    Logout,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
