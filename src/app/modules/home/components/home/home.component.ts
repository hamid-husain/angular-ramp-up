import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@shared/navbar/navbar.component';
@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterOutlet, NavbarComponent, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  isRootRoute = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isRootRoute = this.router.url === '/';
    });
  }

  ngOnInit(): void {
    if (this.router.url === '/') {
      this.router.navigate(['/auth/login']);
    }
  }
}
