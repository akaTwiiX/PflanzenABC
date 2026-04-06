import type { Routes } from '@angular/router';
import { MainTabsPage } from './pages/main-tabs/main-tabs.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home', // ✅ Auf Root-Ebene
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainTabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
      },
      {
        path: 'notice',
        loadComponent: () => import('./pages/notice/notice.page').then(m => m.NoticePage),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage),
      },
      {
        path: 'add-plant',
        loadComponent: () => import('./pages/add-plant/add-plant.page').then(m => m.AddPlantPage),
      },
      {
        path: 'collection/:id',
        loadComponent: () =>
          import('./pages/collection/collection.page').then(m => m.CollectionPage),
      },
      {
        path: 'plant/:id',
        loadComponent: () => import('./pages/plant/plant.page').then(m => m.PlantPage),
      },
    ],
  },
];
