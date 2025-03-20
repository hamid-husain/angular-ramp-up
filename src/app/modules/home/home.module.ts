import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/auth.guard';

const routes:Routes =[
  {
    path :'', 
    loadComponent:()=> import('@app/modules/home/components/home/home.component').then(m=>m.HomeComponent), 
    children:[
      {path :'auth', loadChildren:()=> import('@app/modules/auth/auth.module').then(m=>m.AuthModule), canActivate:[authGuard]},
      {path :'dashboard', loadChildren:()=> import('@app/modules/dashboard/dashboard.module').then(m=>m.DashboardModule), canActivate:[authGuard]},
      {path :'article', loadChildren:()=> import('@app/modules/articles/articles.module').then(m=>m.ArticlesModule), canActivate:[authGuard]},
    ]
  },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HomeModule { }
