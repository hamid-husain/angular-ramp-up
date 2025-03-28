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
import { AuthServicesService } from '@modules/auth/services/auth-services.service';
import { HotToastService } from '@ngneat/hot-toast';
import { catchError, throwError } from 'rxjs';

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
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
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
    private authService: AuthServicesService,
    private toast: HotToastService,
    private router: Router
  ) {}

  get username() {
    return this.signupForm.get('username');
  }
  get email() {
    return this.signupForm.get('email');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get cPassword() {
    return this.signupForm.get('cPassword');
  }

  submit() {
    if (!this.signupForm.valid) {
      const usernameLength = this.username?.value?.length || 0;
      if (usernameLength < 3) {
        this.toast.error('Username should be at least 3 characters long');
      }

      if (this.password?.value !== this.cPassword?.value) {
        this.toast.error('Password and Confirm Password should match');
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
          this.toast.error(
            'Password must be at least 8 characters long, and contain at least 2 numeric and 2 special characters'
          );
        }
      }

      return;
    }

    const { username, email, password } = this.signupForm.value;

    this.authService
      .signup(username!, email!, password!)
      .pipe(
        this.toast.observe({
          loading: 'Signing in....',
          success: 'Signed up successfully',
          error: ({ message }) => `there is an error: ${message}`,
        }),
        catchError(err => {
          this.toast.close();
          this.toast.error('An error occurred. Please try again later.');
          return throwError(() => err);
        })
      )
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: err => console.error('Error: ', err),
      });
  }
}
