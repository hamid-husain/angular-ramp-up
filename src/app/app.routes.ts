import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('@app/modules/auth/auth.module').then(m => m.AuthModule),
        canActivate: [authGuard],
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('@app/modules/dashboard/dashboard.module').then(
            m => m.DashboardModule
          ),
        canActivate: [authGuard],
      },
      {
        path: 'article',
        loadChildren: () =>
          import('@app/modules/articles/articles.module').then(
            m => m.ArticlesModule
          ),
        canActivate: [authGuard],
      },
      {
        path: '**',
        redirectTo: 'auth/login',
        pathMatch: 'full',
      },
    ],
  },
];
