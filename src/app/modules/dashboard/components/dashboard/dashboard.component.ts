import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServicesService } from '@modules/auth/services/auth-services.service';
import { ArticleListComponent } from '@modules/dashboard/components/article-list/article-list.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ArticleListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
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
