import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { Article } from '@app/core/models/article.model';
import { Filter } from '@app/core/models/filter.model';
import { ArticleCardComponent } from '@modules/dashboard/components/article-card/article-card.component';
import { ArticleFilterComponent } from '@modules/dashboard/components/article-filter/article-filter.component';
import { DashboardService } from '@modules/dashboard/services/dashboard.service';
import { DocumentSnapshot } from 'firebase/firestore';

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
  ],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss',
})
export class ArticleListComponent implements OnInit {
  pageSize = 10;
  pageIndex = 0;
  totalArticles = 10;
  lastVisible: DocumentSnapshot | null = null;
  paginatedArticles: Article[] = [];

  articles: Article[] = [];
  filter: Filter = {
    author: '',
    created_at: null,
    tag: '',
  };

  constructor(
    private dashboardService: DashboardService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const savedFilter = localStorage.getItem('articleFilter');
    if (savedFilter) {
      this.filter = JSON.parse(savedFilter);
    }

    this.activatedRoute.queryParams.subscribe(params => {
      this.pageIndex = params['pageIndex'] ? +params['pageIndex'] : 0;
      this.getArticles();
      this.getArticlesCount();
    });
  }

  async getArticles(): Promise<void> {
    try {
      console.log(this.filter);
      const { articleList, lastVisibleDoc } =
        await this.dashboardService.fetchArticles(
          this.filter,
          this.pageSize,
          this.lastVisible
        );
      this.articles = articleList;
      this.lastVisible = lastVisibleDoc;
      this.articles.forEach(article => {
        article.title = this.truncateContent(article.title, 20);
        article.author = this.truncateContent(article.author, 12);
        article.desc = this.truncateContent(article.desc, 100);
      });
      console.log('Fetched articles:', this.articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
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
      console.log('Saved articles:', article);
    } catch (error) {
      console.error('Error fetching articles:', error);
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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.filter = result;
        this.lastVisible = null;
        this.getArticlesCount();
        this.getArticles();

        localStorage.setItem('articleFilter', JSON.stringify(this.filter));
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getArticles();
  }

  isFilterApplied(): boolean {
    return (
      this.filter.author.length > 0 ||
      this.filter.created_at != null ||
      this.filter.tag.length > 0
    );
  }

  clearFilter(): void {
    this.filter = {
      author: '',
      created_at: null,
      tag: '',
    };
    localStorage.removeItem('articleFilter');
    this.lastVisible = null;
    this.getArticles();
    this.getArticlesCount();
  }
}
