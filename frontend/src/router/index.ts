import { defineRouter } from '#q-app/wrappers';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from 'stores/auth';
import routes from './routes';

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = createWebHistory;
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    history: createHistory(process.env.VUE_ROUTER_BASE),
    routes: routes,
  });

  Router.beforeEach((to) => {
    const authStore = useAuthStore();
    if (!to.path.startsWith('/oauth') && !authStore.BnetToken) return { name: 'Login' };
  });

  return Router;
});
