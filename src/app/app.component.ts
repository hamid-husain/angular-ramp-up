import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { constants } from '@app/app.constants';
import { ButtonComponent } from '@shared/button/button.component';
import { NavbarComponent } from '@shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    RouterLink,
    MatButtonModule,
    CommonModule,
    ButtonComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isRootRoute = false;
  dashboardRoute = constants.ROUTES.DASHBOARD;
  title = 'mini-social-network';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isRootRoute = this.router.url === constants.ROUTES.ROOT;
    });
  }
}
