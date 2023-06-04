import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'register',
        loadComponent: () => import('../Register/Register.page').then(m => m.RegisterPage)
      },
      {
        path: 'details',
        loadComponent: () => import('../Details/Details.page').then(m => m.DetailsPage)
      },
      {
        path: '',
        redirectTo: '/tabs/details',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/details',
    pathMatch: 'full'
  }
];

