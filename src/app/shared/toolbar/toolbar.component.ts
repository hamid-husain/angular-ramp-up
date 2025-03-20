import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

import { AuthServicesService } from '../../modules/auth/services/auth-services.service';

@Component({
  selector: 'app-toolbar',
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
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  constructor(
    public authService: AuthServicesService,
    private router: Router,
    private toast: HotToastService
  ) {}

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
        this.router.navigate(['/']);
      });
  }
}
