import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

type ButtonColor = 'primary' | 'accent' | 'warn';
type ButtonType = 'submit' | 'button';

@Component({
  selector: 'app-button',
  imports: [
    MatButtonModule,
    RouterLink,
    MatIconModule,
    CommonModule,
    MatTooltipModule,
    MatBadgeModule,
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent implements OnInit {
  @Input() label = '';
  @Input() color?: ButtonColor;
  @Input() disabled = false;
  @Input() type: ButtonType = 'button';
  @Input() routerLink?: string;
  @Input() icon?: string;
  @Input() style?: string;
  @Input() iconStyle?: string;
  @Input() theme?: string;
  @Input() toolTip?: string;
  @Input() filterBadge?: string;
  @Input() isFilterApplied = false;

  ngOnInit() {
    if (!this.icon) {
      this.iconStyle = 'display:none;';
    }
  }
}
