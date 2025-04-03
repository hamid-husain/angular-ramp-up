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
import { Router, RouterLink } from '@angular/router';

import { HotToastService } from '@ngneat/hot-toast';
import { catchError, throwError } from 'rxjs';

import { constants } from '@app/app.constants';
import { AuthService } from '@shared/authServices/auth.service';
import { ButtonComponent } from '@shared/button/button.component';

@Component({
  selector: 'app-sign-up',
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
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  loginRoute = constants.ROUTE_LOGIN;

  signupForm = new FormGroup({
    username: new FormControl('', [
      Validators.minLength(3),
      Validators.required,
      Validators.maxLength(12),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(254),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
    ]),
    cPassword: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private toast: HotToastService,
    private router: Router
  ) {}

  get username() {
    return this.signupForm.get(constants.USERNAME);
  }
  get email() {
    return this.signupForm.get(constants.EMAIL);
  }
  get password() {
    return this.signupForm.get(constants.PASSWORD);
  }
  get cPassword() {
    return this.signupForm.get(constants.CPASSWORD);
  }

  submit() {
    if (!this.signupForm.valid) {
      const usernameLength = this.username?.value?.length || 0;
      if (usernameLength < 3) {
        this.toast.error(constants.ERR_USERMAME_MIN);
      }

      if (this.password?.value !== this.cPassword?.value) {
        this.toast.error(constants.ERR_PASSWORD_CPASSWORD_MATCH);
      }

      const password = this.password?.value;
      if (password) {
        const isPasswordLengthValid = password.length >= 8;
        const hasNumeric = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const numericCount = (password.match(/\d/g) || []).length;
        const specialCount = (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || [])
          .length;

        if (
          !isPasswordLengthValid ||
          !hasNumeric ||
          !hasSpecialChar ||
          numericCount < 2 ||
          specialCount < 2
        ) {
          this.toast.error(constants.ERR_PASSWORD_STRENGTH);
        }
      }

      return;
    }

    const { username, email, password } = this.signupForm.value;

    this.authService
      .signup(username!, email!, password!)
      .pipe(
        this.toast.observe({
          loading: constants.SIGNUP_LOADING,
          success: constants.SIGNUP_SUCCESS,
          error: ({ message }) => `there is an error: ${message}`,
        }),
        catchError(err => {
          this.toast.close();
          this.toast.error(constants.ERR_ERROR);
          return throwError(() => err);
        })
      )
      .subscribe({
        next: () => this.router.navigate([constants.ROUTE_DASHBOARD]),
        error: err => console.error('Error: ', err),
      });
  }
}
