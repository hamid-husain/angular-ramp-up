import { Component } from '@angular/core';

import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-page-not-found',
  imports: [ButtonComponent],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
})
export class PageNotFoundComponent {}
