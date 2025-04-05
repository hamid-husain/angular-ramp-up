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

import { constants } from '@app/app.constants';
import { AuthService } from '@shared/authServices/auth.service';
import { ButtonComponent } from '@shared/button/button.component';

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
    ButtonComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  currentRoute = '';
  RouteDashboard = constants.ROUTES.DASHBOARD;
  RouteLogin = constants.ROUTES.LOGIN;
  RouteRoot = constants.ROUTES.ROOT;
  RouteSignup = constants.ROUTES.SIGNUP;
  Login = constants.LOGIN;
  SignUp = constants.SIGNUP;
  LoginIcon = constants.LOGIN_ICON;
  signUpIcon = constants.SIGNUP_ICON;

  constructor(
    public authService: AuthService,
    private router: Router,
    private toast: HotToastService
  ) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url.split('?')[0];
    });
  }

  /**
   * User logout
   */
  logout() {
    this.authService
      .logout()
      .pipe(
        this.toast.observe({
          loading: constants.LOGOUT_LOADING,
          success: constants.LOGOUT_SUCCESS,
          error: ({ message }) => `there is an error: ${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate([constants.ROUTES.LOGIN]);
      });
  }
}
