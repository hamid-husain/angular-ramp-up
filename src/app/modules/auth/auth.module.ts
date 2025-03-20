import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideFirebaseApp } from '@angular/fire/app';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('@authComponents/login/login.component').then(
        m => m.LoginComponent
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('@authComponents/sign-up/sign-up.component').then(
        m => m.SignUpComponent
      ),
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthModule {}
