import axios, { type AxiosStatic, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from 'stores/auth';
import type { Item, EquippedItem, SearchResult, Media } from './models';

const HTTP = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
}) as AxiosStatic;

const authInterceptor = (config: InternalAxiosRequestConfig) => {
  const authStore = useAuthStore();
  if (config.url) config.url = config.url.toLowerCase();
  if (authStore.BnetToken) config.headers.Authorization = `Bearer ${authStore.BnetToken}`;
  else config.withCredentials = false;
  return config;
};

const gd = HTTP.create({
  baseURL: 'https://eu.api.blizzard.com/data/wow/',
  params: {
    namespace: 'static-classic-eu',
    locale: 'en_GB',
  },
});
gd.interceptors.request.use(authInterceptor);

const pd = HTTP.create({
  baseURL: 'https://eu.api.blizzard.com/profile/wow/',
  params: {
    namespace: 'profile-classic-eu',
    locale: 'en_GB',
  },
});
pd.interceptors.request.use(authInterceptor);

const ud = HTTP.create({
  baseURL: 'https://oauth.battle.net/oauth/userinfo',
  headers: {
    region: 'eu',
  },
});
ud.interceptors.request.use(authInterceptor);

const ad = HTTP.create({
  baseURL: 'https://eu.api.blizzard.com/profile/user/wow',
  params: {
    namespace: 'profile-classic-eu',
    locale: 'en_GB',
  },
});
ad.interceptors.request.use(authInterceptor);

const api = {
  user: {
    info: () => ud.get(''),
    accounts: () => ad.get(''),
  },
  class: {
    get_icon: (id: number) =>
      gd.get(`media/playable-class/${id}`).then((resp) => resp.data.assets[0].value),
    list: () => gd.get('playable-class/index'),
  },
  races: () => gd.get('playable-race/index'),
  guild: {
    get: (realm: string, name: string) =>
      gd.get(`guild/${realm}/${name}`, { params: { namespace: 'profile-classic-eu' } }),
    roster: (realm: string, name: string) =>
      gd.get(`guild/${realm}/${name}/roster`, { params: { namespace: 'profile-classic-eu' } }),
  },
  character: {
    get: (realm: string, name: string) => pd.get(`character/${realm}/${name}`),
    getEquipment: (realm: string, name: string) =>
      pd
        .get(`character/${realm}/${name}/equipment`)
        .then<EquippedItem[]>((resp) => resp.data.equipped_items),
  },
  item: {
    search: (ids: number[]) =>
      gd
        .get('search/item?id=' + ids.join('||'))
        .then<Item[]>((resp) => resp.data.results.map((i: SearchResult<Item>) => i.data)),
  },
  media: {
    search: (tags: string, ids: number[]) =>
      gd
        .get(`search/media?_pageSize=1000&tags=${tags}&id=${ids.join('||')}`)
        .then<Media[]>((resp) => resp.data.results.map((i: SearchResult<Media>) => i.data)),
  },
};

export default api;
