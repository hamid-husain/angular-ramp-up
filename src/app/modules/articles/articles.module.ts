import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'create',
    loadComponent: () =>
      import(
        '@modules/articles/components/create-article/create-article.component'
      ).then(m => m.CreateArticleComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import(
        '@modules/articles/components/create-article/create-article.component'
      ).then(m => m.CreateArticleComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        '@modules/articles/components/article-detail/article-detail.component'
      ).then(m => m.ArticleDetailComponent),
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticlesModule {}
