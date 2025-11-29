import { Routes } from '@angular/router';
import { MainTabsPage } from './main-tabs.page';

export const mainTabsRoutes: Routes = [
  {
    path: '',
    component: MainTabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('../home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'notice',
        loadComponent: () => import('../notice/notice.page').then(m => m.NoticePage)
      },
      {
        path: 'settings',
        loadComponent: () => import('../settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
      {
        path: 'add-plant',
        loadComponent: () => import('../add-plant/add-plant.page').then((m) => m.AddPlantPage),
      },
      {
        path: 'collection/:id',
        loadComponent: () => import('../collection/collection.page').then((m) => m.CollectionPage),
      },
      {
        path: 'plant/:id',
        loadComponent: () => import('../plant/plant.page').then((m) => m.PlantPage),
      },
    ],
  },
];
