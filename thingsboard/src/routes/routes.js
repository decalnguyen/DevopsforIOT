import { LoginLayout, MainLayout } from '~/layouts';
import { DevicesPage } from '~/components/DevicesPage';
import config from '~/config';
import Home from '~/components/Home';
import DashboardPage from '~/components/pages/DashboardPage';
export const routes = [
  {
    path: config.routes.home,
    component: Home,
    layout: null,
  },
  {
    path: config.routes.devices,
    component: DevicesPage,
    layout: MainLayout,
  },
  {
    path: config.routes.login,
    component: LoginLayout,
    layout: null,
  },
  {
    path: config.routes.dashboard,
    component: DashboardPage,
    layout: MainLayout,
  },
];
