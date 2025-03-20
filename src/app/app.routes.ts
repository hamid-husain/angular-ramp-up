import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { SignUpComponent } from './modules/auth/sign-up/sign-up.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@app/modules/home/home.module').then(m => m.HomeModule),
  },
];
