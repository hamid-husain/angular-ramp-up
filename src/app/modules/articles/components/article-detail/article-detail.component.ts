import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'firebase/auth';
import { Observable } from 'rxjs';

import { constants } from '@app/app.constants';
import { Article } from '@app/core/models/article.model';
import { DeleteConfirmationComponent } from '@modules/articles/components/delete-confirmation/delete-confirmation.component';
import { ArticlesService } from '@modules/articles/services/articles.service';
import { AuthService } from '@shared/authServices/auth.service';
import { ButtonComponent } from '@shared/button/button.component';

@Component({
  selector: 'app-article-detail',
  imports: [
    MatCardModule,
    CommonModule,
    MatChipsModule,
    MatIconModule,
    ButtonComponent,
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
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.user$ = this.authService.currentUser$;

    this.article = {} as Article;
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.articleID = params.get(constants.ID);
      if (this.articleID) {
        this.loadArticle();
      }
    });
  }

  /**
   * back to dashboard
   */
  backToDashboard(): void {
    this.router.navigate([constants.ROUTES.DASHBOARD]);
  }

  /**
   * populate the article
   */
  async loadArticle() {
    try {
      this.article = await this.articleService.loadArticleByID(this.articleID!);
      if (this.article) {
        this.user$.subscribe(user => {
          if (user) {
            this.isAuthor = this.article.email === user.email;
          }
        });
      }
    } catch (error) {
      console.error(constants.ERR_LOADING_ARTICLE, error);
    }
  }

  /**
   * redirect to edit route
   */
  editArticle() {
    this.router.navigate([
      `${constants.ROUTES.ARTICLE}/${this.articleID}/edit`,
    ]);
  }

  /**
   * open delete confirmation modal
   */
  openDeleteConfirmationDialog() {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.deleteArticle();
      }
    });
  }

  /**
   * function to delete article
   */
  async deleteArticle() {
    if (this.articleID) {
      try {
        await this.articleService.deleteArticle(this.articleID);
        this.router.navigate([constants.ROUTES.DASHBOARD]);
      } catch (error) {
        console.error(constants.ERR_DELETING_ARTICLE, error);
      }
    }
  }
}
