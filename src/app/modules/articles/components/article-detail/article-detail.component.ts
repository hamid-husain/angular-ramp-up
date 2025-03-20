import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesService } from '@articleServices/articles.service';
import { AuthServicesService } from '@authServices/auth-services.service';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-article-detail',
  imports: [MatCardModule, CommonModule, MatButton, RouterLink],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.scss',
})
export class ArticleDetailComponent {
  articleID: string | null = null;
  isAuthor: boolean = false;
  article: any;
  user$;

  constructor(
    private router: Router,
    private articleService: ArticlesService,
    private authService: AuthServicesService,
    private activatedRoute: ActivatedRoute
  ) {
    this.user$ = this.authService.currentUser$;
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
