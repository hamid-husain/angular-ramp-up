import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleListComponent } from '@dashboardComponents/article-list/article-list.component';

import { AuthServicesService } from '../auth/services/auth-services.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ArticleListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  user$;

  constructor(
    private authService: AuthServicesService,
    private router: Router
  ) {
    this.user$ = this.authService.currentUser$;
  }
}
