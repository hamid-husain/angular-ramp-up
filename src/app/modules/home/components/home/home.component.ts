import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@shared/navbar/navbar.component';
@Component({
  selector: 'app-home',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private router: Router) {
    this.router.navigate(['/auth/login']);
  }
}
