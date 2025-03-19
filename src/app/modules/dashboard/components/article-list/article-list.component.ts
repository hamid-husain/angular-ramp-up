import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service'
import { ArticleFilterComponent } from '../article-filter/article-filter.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DocumentSnapshot } from 'firebase/firestore';

interface Article {
  title: string;
  desc: string;
  author: string;
  created_at: Date;
}

interface Filter {
  author: string;
  created_at: Date | null;
  tag: string;
}

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
],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss'
})

export class ArticleListComponent {
  pageSize: number = 10;
  pageIndex: number = 0;
  totalArticles: number = 10
  lastVisible: DocumentSnapshot | null = null
  paginatedArticles: any[] = [];

  articles: Article[] = [];
  filter: Filter = {
    author: '',
    created_at: null,
    tag: ''
  };

  constructor(private dashboardService:DashboardService, private dialog: MatDialog, private activatedRoute: ActivatedRoute, private router:Router){ }

  ngOnInit(){
    this.activatedRoute.queryParams.subscribe((params) => {
      this.pageIndex = params['pageIndex'] ? +params['pageIndex'] : 0;
      this.getArticles();
      this.getArticlesCount();
    });
  }

  async getArticles(): Promise<void> {
    try {
      console.log(this.filter)
      const {articleList, lastVisibleDoc} = await this.dashboardService.fetchArticles(this.filter, this.pageSize, this.lastVisible)
      this.articles = articleList;
      this.lastVisible = lastVisibleDoc;
      this.articles.forEach(article=>{
        article.title = this.truncateContent(article.title,20)
        article.author = this.truncateContent(article.author,12)
        article.desc= this.truncateContent(article.desc, 100)
      })
      console.log('Fetched articles:', this.articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  }

  async getArticlesCount(){
    this.totalArticles = await this.dashboardService.getArticlesCount(this.filter);
  }

  async saveArticle(article: { title: string; desc: string, author:string, created_at:Date }): Promise<void>{
    try {
      await this.dashboardService.addArticle(article)
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
      data: this.filter
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.filter = result;
        this.lastVisible=null;
        this.getArticlesCount();
        this.getArticles();
      }
    });
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getArticles();
  }
}
