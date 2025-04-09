import axios, { type AxiosStatic, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from 'stores/auth';

const authStore = useAuthStore();

const HTTP = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
}) as AxiosStatic;

const authInterceptor = (config: InternalAxiosRequestConfig) => {
  if (authStore.BnetProfile) config.headers.Authorization = `Bearer ${authStore.BnetProfile.access_token}`;
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
  baseURL: 'https://eu.api.blizzard.com/profile/user/wow',
  params: {
    namespace: 'profile-classic-eu',
    locale: 'en_GB',
  },
});
ud.interceptors.request.use(authInterceptor);

export declare interface Class {
  id: number;
  name: string;
  icon?: string;
}

export declare interface Character {
  id: number;
  name: string;
  level: number;
  playable_class: {
    id: number;
  };
  playable_race: {
    id: number;
  };
}

export declare interface Member {
  rank: number;
  character: Character;
}

const api = {
  user: () => ud.get(''),
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
  },
};

export default api;
