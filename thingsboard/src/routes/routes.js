import { LoginLayout, MainLayout } from '~/layouts';
import { DevicesPage } from '~/components/DevicesPage';
import config from '~/config';
import Home from '~/components/Home';
import DashboardPage from '~/components/pages/DashboardPage';

export const privateRoutes = [
  {
    path: config.privateRoutes.home,
    component: Home,
    layout: null,
  },
  {
    path: config.privateRoutes.devices,
    component: DevicesPage,
    layout: MainLayout,
  },
  {
    path: config.privateRoutes.dashboard,
    component: DashboardPage,
    layout: MainLayout,
  },
];

export const publicRoutes = [
  {
    path: config.publicRoutes.login,
    component: LoginLayout,
    layout: null,
  },

]