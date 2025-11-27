import { Routes } from '@angular/router';
import { mainTabsRoutes } from './pages/main-tabs/main-tabs.routes';

export const routes: Routes = [
  {
    path: '',
    children: mainTabsRoutes,
  },
];
