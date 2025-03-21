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
    @Inject(MAT_DIALOG_DATA) public data: Filter
  ) {
    if (data) {
      this.filter = { ...data };
    }

    this.authors = [...this.dashboardService.authors];
    this.tags = [...this.dashboardService.tags];
  }

  applyFilters() {
    this.dialogRef.close(this.filter);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
