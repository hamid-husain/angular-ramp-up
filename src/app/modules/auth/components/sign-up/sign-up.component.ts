import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
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

import { AuthServicesService } from '../../services/auth-services.service';

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;

    const lengthValid = password && password.length >= 8;
    const hasNumeric = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const numericCount = (password.match(/\d/g) || []).length;
    const specialCount = (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || [])
      .length;

    if (
      lengthValid &&
      hasNumeric &&
      hasSpecialChar &&
      numericCount >= 2 &&
      specialCount >= 2
    ) {
      return null;
    }

    return {
      passwordStrength: true,
    };
  };
}

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const cPassword = control.get('cPassword')?.value;

    if (password && cPassword && password !== cPassword) {
      return {
        PasswordDoesntMatch: true,
      };
    }

    return null;
  };
}

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
  signupForm = new FormGroup(
    {
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
        passwordStrengthValidator(),
        Validators.maxLength(20),
      ]),
      cPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator() }
  );

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

  getErrorMessages(control: AbstractControl | null): string[] {
    if (!control || !control.errors) return [];

    const errorMessages: string[] = [];
    const errors = control.errors;

    if (errors['required']) {
      errorMessages.push('This field is required');
    }
    if (errors['minLength']) {
      errorMessages.push(
        `Minimum length: ${errors['minLength'].requiredLength}`
      );
    }
    if (errors['maxLength']) {
      errorMessages.push(
        `Maximum length: ${errors['maxLength'].requiredLength}`
      );
    }
    if (errors['email']) {
      errorMessages.push('Enter a valid email');
    }
    if (errors['passwordStrength']) {
      errorMessages.push(
        'Password must be at least 8 characters long, and contain at least 2 numeric and 2 special characters'
      );
    }
    if (errors['PasswordDoesntMatch']) {
      errorMessages.push('Passwords should match');
    }

    return errorMessages;
  }

  submit() {
    if (!this.signupForm.valid) {
      return;
    }

    const { username, email, password } = this.signupForm.value;
    console.log(username);
    console.log(email);
    console.log(password);

    this.authService
      .signup(username!, email!, password!)
      .pipe(
        this.toast.observe({
          loading: 'Signing in....',
          success: 'Signed up successfully',
          error: ({ message }) => `there is an error: ${message}`,
        }),
        catchError((err, caught) => {
          this.toast.close();
          this.toast.error('An error occurred. Please try again later.');
          console.log('error: ', err);
          return throwError(() => err);
        })
      )
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: err => console.log('Error: ', err),
      });
  }
}
