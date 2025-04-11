import { defineRouter } from '#q-app/wrappers';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from 'stores/auth';

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = createWebHistory;
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    history: createHistory(process.env.VUE_ROUTER_BASE),
    routes: [
      {
        name: 'Login',
        path: '/oauth/',
        component: () => import('pages/LoginPage.vue'),
        children: [
          {
            path: 'bnet',
            name: 'BnetCallBack',
            component: () => import('components/oauth/bnetCallback.vue'),
          },
        ],
      },
      {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
      },
      {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
      },
    ],
  });

  Router.beforeEach((to) => {
    const authStore = useAuthStore();
    if (!to.path.startsWith('/oauth') && !authStore.BnetToken) return { name: 'Login' };
  });

  return Router;
});
