import { lazy } from 'react';

const routes = {
  HOME: {
    path: `/home/?page=1`,
    component: lazy(() =>
      import('./pages/Home' /* webpackChunkName: "HomePage" */)
    ),
  },

  HERO: {
    path: `/hero/:id`,
    component: lazy(() =>
      import('./pages/Hero' /* webpackChunkName: "Hero" */)
    ),
  },
};
export default routes;
