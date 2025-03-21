import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Article } from '@app/core/models/article.model';
import { ArticlesService } from '@modules/articles/services/articles.service';
import { AuthServicesService } from '@modules/auth/services/auth-services.service';

@Component({
  selector: 'app-article-detail',
  imports: [MatCardModule, CommonModule, MatButton, RouterLink, MatChipsModule],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.scss',
})
export class ArticleDetailComponent implements OnInit {
  articleID: string | null = null;
  isAuthor = false;
  article: Article;

  user$;

  constructor(
    private router: Router,
    private articleService: ArticlesService,
    private authService: AuthServicesService,
    private activatedRoute: ActivatedRoute
  ) {
    this.user$ = this.authService.currentUser$;

    this.article = {} as Article;
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.articleID = params.get('id');
      if (this.articleID) {
        this.loadArticle();
      }
    });
  }

  async loadArticle() {
    try {
      this.article = await this.articleService.loadArticleByID(this.articleID!);
      if (this.article) {
        this.user$.subscribe(user => {
          if (user) {
            this.isAuthor = this.article.author === user.displayName;
          }
        });
      }
    } catch (error) {
      console.error('Error loading article:', error);
    }
  }

  editArticle() {
    this.router.navigate([`article/${this.articleID}/edit`]);
  }

  async deleteArticle() {
    if (this.articleID) {
      const confirmed = confirm(
        'Are you sure you want to delete this article?'
      );
      if (confirmed) {
        try {
          await this.articleService.deleteArticle(this.articleID);
          console.log('Article deleted successfully');
          this.router.navigate(['/dashboard']);
        } catch (error) {
          console.error('Error deleting article:', error);
        }
      }
    }
  }
}
