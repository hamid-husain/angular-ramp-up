import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'create',
    loadComponent: () =>
      import(
        '@modules/articles/components/create-article/create-article.component'
      ).then(m => m.CreateArticleComponent),
    canActivate: [authGuard],
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import(
        '@modules/articles/components/create-article/create-article.component'
      ).then(m => m.CreateArticleComponent),
    canActivate: [authGuard],
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        '@modules/articles/components/article-detail/article-detail.component'
      ).then(m => m.ArticleDetailComponent),
    canActivate: [authGuard],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticlesModule {}
