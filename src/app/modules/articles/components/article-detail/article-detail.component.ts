import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from '@app/core/models/article.model';
import { DeleteConfirmationComponent } from '@modules/articles/components/delete-confirmation/delete-confirmation.component';
import { ArticlesService } from '@modules/articles/services/articles.service';
import { AuthServicesService } from '@modules/auth/services/auth-services.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-article-detail',
  imports: [
    MatCardModule,
    CommonModule,
    MatButton,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.scss',
})
export class ArticleDetailComponent implements OnInit {
  articleID: string | null = null;
  isAuthor = false;
  article: Article;

  user$: Observable<User | null>;

  constructor(
    private router: Router,
    private articleService: ArticlesService,
    private authService: AuthServicesService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
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

  backToDashboard() {
    this.router.navigate(['/dashboard']);
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

  openDeleteConfirmationDialog() {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.deleteArticle();
      }
    });
  }

  async deleteArticle() {
    if (this.articleID) {
      try {
        await this.articleService.deleteArticle(this.articleID);
        this.router.navigate(['/dashboard']);
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  }
}
