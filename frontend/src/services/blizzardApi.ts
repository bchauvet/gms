import axios, { type AxiosStatic } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const getToken = async () => {
  await axios
    .post(
      'https://oauth.battle.net/token',
      {
        grant_type: 'client_credentials',
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: process.env.BLIZZARD_CLIENT_ID!,
          password: process.env.BLIZZARD_CLIENT_SECRET!,
        },
      },
    )
    .then((resp) => {
      localStorage.setItem('authToken', resp.data.access_token);
    });
};
const HTTP = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
}) as AxiosStatic;

const authInterceptor = (config: InternalAxiosRequestConfig) => {
  if (localStorage.authToken) config.headers.Authorization = `Bearer ${localStorage.authToken}`;
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
gd.interceptors.request.use(authInterceptor);

export declare interface Class {
  id: number;
  name: string;
  icon?: string;
}

const api = {
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

export { api, HTTP, getToken };
