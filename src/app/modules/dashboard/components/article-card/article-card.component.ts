import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { Article } from '@app/core/models/article.model';

@Component({
  selector: 'app-article-card',
  imports: [CommonModule, MatCardModule, RouterLink, MatChipsModule, MatButton],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss',
})
export class ArticleCardComponent {
  @Input() article: Article;

  constructor() {
    this.article = {} as Article;
  }
}
