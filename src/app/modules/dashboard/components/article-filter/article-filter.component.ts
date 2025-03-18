import { Component, Inject } from '@angular/core';
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
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';

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
    FormsModule
  ],
  templateUrl: './article-filter.component.html',
  styleUrl: './article-filter.component.scss'
})
export class ArticleFilterComponent {
  authors;
  tags;
  
  constructor(private dashboardService: DashboardService, private dialogRef: MatDialogRef<ArticleFilterComponent>,  @Inject(MAT_DIALOG_DATA) public data: any ) {
    if(data){
      this.filter={...data}
    }

    this.authors = this.dashboardService.authors
    this.tags=this. dashboardService.tags
    
  }

  filter = {
    author: '',
    created_at: '',
    tag: ''
  };

  applyFilters() {
    this.dialogRef.close(this.filter)
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
