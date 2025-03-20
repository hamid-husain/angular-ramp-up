import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/auth.guard';

const routes:Routes=[
  {path: 'create', loadComponent:()=> import('@articleComponents/create-article/create-article.component').then(m=>m.CreateArticleComponent), canActivate:[authGuard]},
  {path: ':id/edit', loadComponent:()=> import('@articleComponents/create-article/create-article.component').then(m=>m.CreateArticleComponent), canActivate:[authGuard]},
  {path: ':id', loadComponent:()=> import('@articleComponents/article-detail/article-detail.component').then(m=>m.ArticleDetailComponent), canActivate:[authGuard]},
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class ArticlesModule {}
