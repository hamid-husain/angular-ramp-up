import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

import { constants } from '@app/app.constants';
import { Article } from '@app/core/models/article.model';
import { ButtonComponent } from '@shared/button/button.component';

@Component({
  selector: 'app-article-card',
  imports: [
    CommonModule,
    MatCardModule,
    RouterLink,
    MatChipsModule,
    ButtonComponent,
  ],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss',
})
export class ArticleCardComponent {
  @Input() article: Article;
  articleRoute = constants.ROUTES.ARTICLE;

  constructor() {
    this.article = {} as Article;
  }
}
