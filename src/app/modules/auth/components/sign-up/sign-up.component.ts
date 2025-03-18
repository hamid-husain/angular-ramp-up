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

import { AuthServicesService } from '../services/auth-services.service';
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
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  signupForm = new FormGroup(
    {
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        passwordStrengthValidator(),
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
        })
      )
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
  }
}
