import { NgModule } from '@angular/core';
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
