import { defineRouter } from '#q-app/wrappers';
import {
  createRouter,
  createWebHistory,
} from 'vue-router';
import routes from './routes';

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = createWebHistory;
  return createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    history: createHistory(process.env.VUE_ROUTER_BASE),
    routes,
  });
});
