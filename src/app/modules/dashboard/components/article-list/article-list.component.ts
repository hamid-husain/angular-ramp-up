import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';

import { DocumentSnapshot } from 'firebase/firestore';

import { constants } from '@app/app.constants';
import { Article } from '@app/core/models/article.model';
import { Filter } from '@app/core/models/filter.model';
import { ButtonComponent } from '@app/shared/components/button/button.component';
import { DashboardRouteService } from '@app/shared/services/dashboardRouteServices/dashboard-route.service';
import { ArticleCardComponent } from '@modules/dashboard/components/article-card/article-card.component';
import { ArticleFilterComponent } from '@modules/dashboard/components/article-filter/article-filter.component';
import { DashboardService } from '@modules/dashboard/services/dashboard.service';

@Component({
  selector: 'app-article-list',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    FormsModule,
    MatPaginatorModule,
    RouterLink,
    ArticleCardComponent,
    MatBadgeModule,
    ButtonComponent,
  ],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss',
})
export class ArticleListComponent implements OnInit {
  pageSize = 10;
  pageIndex = 0;
  totalArticles = 10;
  lastVisible: DocumentSnapshot | null = null;
  firstVisible: DocumentSnapshot | null = null;
  paginatedArticles: Article[] = [];

  articles: Article[] = [];
  filter: Filter = {
    author: '',
    created_at: null,
    tags: [],
  };

  constructor(
    private dashboardService: DashboardService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dashboardRoute: DashboardRouteService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const tree = this.router.parseUrl(this.router.url);
      const segments =
        tree.root.children['primary']?.segments.map(s => s.path) || [];
      const queryParams = tree.queryParams;
      this.dashboardRoute.setDashboardRoute(segments, queryParams);

      this.filter.author = params[constants.AUTHOR] || '';
      this.filter.tags = params[constants.TAGS]
        ? params[constants.TAGS].split(',')
        : [];
      this.filter.created_at = params[constants.CREATED_AT]
        ? new Date(params[constants.CREATED_AT])
        : null;
      this.pageIndex = params[constants.PAGE_INDEX]
        ? +params[constants.PAGE_INDEX]
        : 0;
      this.getArticlesCount();
      this.getArticles(this.lastVisible, this.firstVisible);
    });
  }

  async getArticles(
    lastVisible: DocumentSnapshot | null,
    firstVisible: DocumentSnapshot | null
  ): Promise<void> {
    try {
      const { articleList, lastVisibleDoc, firstVisibleDoc } =
        await this.dashboardService.fetchArticles(
          this.filter,
          this.pageSize,
          lastVisible,
          firstVisible
        );
      this.articles = articleList!;
      this.lastVisible = lastVisibleDoc;
      this.firstVisible = firstVisibleDoc!;
      this.articles?.forEach(article => {
        article.title = this.truncateContent(article.title, 20);
        article.author = this.truncateContent(article.author, 12);
        article.desc = this.truncateContent(article.desc, 100);
      });
    } catch (error) {
      console.error(constants.ERR_FETCHING_ARTICLE, error);
    }
  }

  async getArticlesCount() {
    this.totalArticles = await this.dashboardService.getArticlesCount(
      this.filter
    );
  }

  async saveArticle(article: {
    title: string;
    desc: string;
    author: string;
    created_at: Date;
  }): Promise<void> {
    try {
      await this.dashboardService.addArticle(article);
    } catch (error) {
      console.error(constants.ERR_FETCHING_ARTICLE, error);
    }
  }

  truncateContent(content: string, maxLength: number): string {
    if (!content) {
      return '';
    }
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  }

  openFilterModal(): void {
    const dialogRef = this.dialog.open(ArticleFilterComponent, {
      width: '400px',
      data: this.filter,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.lastVisible = null;
      this.firstVisible = null;
      this.getArticlesCount();
      this.getArticles(this.lastVisible, this.firstVisible);
    });
  }

  onPageChange(event: PageEvent): void {
    const previousPageIndex = this.pageIndex;
    this.pageIndex = event.pageIndex;
    if (this.pageIndex > previousPageIndex) {
      this.getArticles(this.lastVisible, null);
    } else if (this.pageIndex < previousPageIndex) {
      this.getArticles(null, this.firstVisible);
    }
    this.pageSize = event.pageSize;
  }

  isFilterApplied(): boolean {
    return (
      this.filter.author.length > 0 ||
      this.filter.created_at != null ||
      this.filter.tags.length > 0
    );
  }

  clearFilter(): void {
    this.filter = {
      author: '',
      created_at: null,
      tags: [''],
    };
    this.router.navigate([], {
      queryParams: {
        author: null,
        tags: null,
        created_at: null,
        pageIndex: null,
      },
      queryParamsHandling: 'merge',
    });
    this.lastVisible = null;
    this.firstVisible = null;
    this.getArticles(this.lastVisible, this.firstVisible);
    this.getArticlesCount();
  }

  get filterBadge() {
    let count = 0;
    if (this.filter.author.length > 0) count++;
    if (this.filter.created_at != null) count++;
    if (this.filter.tags.length > 0) count++;
    return count;
  }
}
