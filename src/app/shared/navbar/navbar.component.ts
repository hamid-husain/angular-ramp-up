import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { AuthServicesService } from '@modules/auth/services/auth-services.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  currentRoute = '';

  constructor(
    public authService: AuthServicesService,
    private router: Router,
    private toast: HotToastService
  ) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  logout() {
    this.authService
      .logout()
      .pipe(
        this.toast.observe({
          loading: 'Logging out....',
          success: 'Logged out successfully',
          error: ({ message }) => `there is an error: ${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['/auth/login']);
      });
  }
}
