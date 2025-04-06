import axios, { type AxiosInstance } from 'axios';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const api = axios.create({ baseURL: 'https://api.example.com' });

export { api };
