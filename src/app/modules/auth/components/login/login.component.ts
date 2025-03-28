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
import { AuthServicesService } from '@modules/auth/services/auth-services.service';
import { HotToastService } from '@ngneat/hot-toast';
import { catchError, throwError } from 'rxjs';

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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthServicesService,
    private router: Router,
    private toast: HotToastService
  ) {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
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
          loading: 'Logging in....',
          success: 'Logged in successfully',
          error: ({ message }) => `there is an error: ${message}`,
        }),
        catchError(err => {
          this.toast.close();
          if (err.code === 'auth/invalid-credential') {
            this.toast.error('Invalid credentials. Please try again.');
          } else {
            this.toast.error('An error occurred. Please try again later.');
          }
          return throwError(() => err);
        })
      )
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: err => console.error('Error: ', err),
      });
  }
}
