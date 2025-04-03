import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button',
  imports: [MatButtonModule, RouterLink, MatIconModule, CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() label = '';
  @Input() color: 'primary' | 'accent' | 'warn' | '' = '';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() routerLink?: string;
  @Input() icon?: string;
  @Input() style?: string;
  @Input() iconStyle?: string;
  @Input() theme?: string;
}
