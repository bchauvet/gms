import { defineRouter } from '#q-app/wrappers';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from 'stores/auth';
import routes from './routes';
import { type BnetUser } from 'src/services';

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = createWebHistory;
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    history: createHistory(process.env.VUE_ROUTER_BASE),
    routes: routes,
  });

  Router.beforeEach(async (to) => {
    const authStore = useAuthStore();
    const user = (await authStore.BnetAuth.getUser()) as BnetUser;
    if (!to.path.startsWith('/oauth') && !user) {
      return { name: 'Login' };
    } else {
      authStore.setUpBnetUser(user);
    }
  });

  return Router;
});
