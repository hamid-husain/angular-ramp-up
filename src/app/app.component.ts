import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { constants } from '@app/app.constants';
import { NavbarComponent } from '@shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    RouterLink,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  isRootRoute = false;
  dashboardRoute = constants.ROUTE_DASHBOARD;
  title = 'mini-social-network';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isRootRoute = this.router.url === constants.ROUTE_ROOT;
    });
  }

  ngOnInit(): void {
    if (this.router.url === constants.ROUTE_ROOT) {
      this.router.navigate([constants.ROUTE_LOGIN]);
    }
  }
}
