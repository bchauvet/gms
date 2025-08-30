import axios, { type AxiosStatic, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from 'stores/auth';
import type { WclCharacter, WclReport } from 'src/services';

const HTTP = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
}) as AxiosStatic;

const getToken = HTTP.post(
  'https://www.warcraftlogs.com/oauth/token',
  {
    grant_type: 'client_credentials',
  },
  {
    auth: {
      username: process.env.WCL_CLIENT_ID!,
      password: process.env.WCL_CLIENT_SECRET!,
    },
  },
).then((resp) => resp.data.access_token);

const cApi = axios.create({
  baseURL: 'https://classic.warcraftlogs.com/api/v2/client',
});

const authInterceptor = (config: InternalAxiosRequestConfig) => {
  const authStore = useAuthStore();
  if (authStore.WclToken) config.headers.Authorization = `Bearer ${authStore.WclToken}`;
  else config.withCredentials = false;
  return config;
};
cApi.interceptors.request.use(authInterceptor);

const api = {
  getToken: getToken,
  getCharLogs: (realm: string, name: string) =>
    cApi
      .post('', {
        query:
          'query getCharacter($name: String, $realm: String, $region: String) { characterData { character(name: $name, serverSlug: $realm, serverRegion: $region){id,name,zoneRankings(size: 10),server{id,name,slug,region{slug}}}}}',
        variables: {
          realm: realm.toLowerCase(),
          name: name,
          region: 'eu',
        },
      })
      .then<WclCharacter>((resp) => resp.data.data.characterData.character),
  getGuildLogs: (realm: string, guild: string) =>
    cApi
      .post('', {
        query:
          'query getGuildLogs($realm: String, $guild: String, $region: String) { reportData { reports(guildName: $guild, guildServerSlug: $realm, guildServerRegion: $region){total,per_page,current_page,data{code}} } }',
        variables: {
          realm: realm.toLowerCase(),
          guild: guild,
          region: 'eu',
        },
      })
      .then<WclReport[]>((resp) => resp.data.data?.reportData?.reports.data),
  getReport: (code: string) =>
    cApi
      .post('', {
        query:
          'query getReport($code: String) { reportData { report(code: $code) { code,startTime,title,zone{name},owner{name},fights{id,name,encounterID,kill,size,startTime,difficulty},playerDetails(fightIDs: [8,13,17,23]) } } }',
        variables: {
          code: code,
        },
      })
      .then<WclReport>((resp) => resp.data.data?.reportData?.report),
};

export default api;
