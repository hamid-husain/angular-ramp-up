import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

import { HotToastService } from '@ngneat/hot-toast';
import { catchError, throwError } from 'rxjs';

import { constants } from '@app/app.constants';
import { ButtonComponent } from '@app/shared/components/button/button.component';
import { AuthService } from '@app/shared/services/authServices/auth.service';
import { DashboardRouteService } from '@app/shared/services/dashboardRouteServices/dashboard-route.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  signupRoute = constants.ROUTES.SIGNUP;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: HotToastService,
    private dashboardRoute: DashboardRouteService
  ) {}

  get email() {
    return this.loginForm.get(constants.EMAIL);
  }

  get password() {
    return this.loginForm.get(constants.PASSWORD);
  }

  submit() {
    if (!this.loginForm.valid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService
      .login(email!, password!)
      .pipe(
        this.toast.observe({
          loading: constants.LOGIN_LOADING,
          success: constants.LOGIN_SUCCESS,
          error: ({ message }) => `there is an error: ${message}`,
        }),
        catchError(err => {
          this.toast.close();
          if (err.code === constants.CODE_INVALID_CREDENTIALS) {
            this.toast.error(constants.ERR_INVALID_CREDENTIALS);
          } else {
            this.toast.error(constants.ERR_ERROR);
          }
          return throwError(() => err);
        })
      )
      .subscribe({
        next: () => {
          const { url, queryParams } = this.dashboardRoute.getDashboardRoute();
          this.dashboardRoute.resetDashboardRoute();
          this.router.navigate(url, { queryParams });
        },
        error: err => console.error('Error: ', err),
      });
  }
}
