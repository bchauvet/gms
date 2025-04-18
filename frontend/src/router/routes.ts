import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/auth/',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('pages/LoginPage.vue'),
      },
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
    children: [
      { path: '', name: 'Home', component: () => import('pages/HomePage.vue') },
      { path: '/profile', name: 'Profile', component: () => import('pages/ProfilePage.vue') },
      {
        path: '/roster',
        name: 'Roster',
        component: () => import('pages/RosterPage.vue'),
        meta: {
          title: 'Roster Overview',
        },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
