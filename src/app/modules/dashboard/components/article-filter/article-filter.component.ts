import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { Filter } from '@app/core/models/filter.model';
import { DashboardService } from '@modules/dashboard/services/dashboard.service';

@Component({
  selector: 'app-article-filter',
  imports: [
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
  ],
  templateUrl: './article-filter.component.html',
  styleUrl: './article-filter.component.scss',
})
export class ArticleFilterComponent {
  authors: string[];
  tags: string[];

  filter: Filter = {
    author: '',
    created_at: null,
    tag: '',
  };

  constructor(
    private dashboardService: DashboardService,
    private dialogRef: MatDialogRef<ArticleFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Filter,
    private router: Router
  ) {
    if (data) {
      this.filter = { ...data };
    }

    this.authors = [...this.dashboardService.authors];
    this.authors.sort();
    this.tags = [...this.dashboardService.tags];
    this.tags.sort();
  }

  applyFilters() {
    this.dialogRef.close();
    let createdAt = this.filter.created_at;
    if (createdAt) {
      createdAt = new Date(createdAt);
      createdAt.setHours(0, 0, 0, 0);
    }
    this.router.navigate([], {
      queryParams: {
        author: this.filter.author,
        tag: this.filter.tag,
        created_at: createdAt ? this.formatDateToISO(createdAt) : null,
        pageIndex: 0,
      },
      queryParamsHandling: 'merge',
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00.000Z`;
  }
}
