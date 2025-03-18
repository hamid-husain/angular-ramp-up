import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/components/login/login.component';
import { SignUpComponent } from './modules/auth/components/sign-up/sign-up.component';
import { AppComponent } from './app.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';

import { AppComponent } from './app.component';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './modules/auth/login/login.component';
import { SignUpComponent } from './modules/auth/sign-up/sign-up.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: 'signup', component: SignUpComponent, canActivate: [authGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
];
