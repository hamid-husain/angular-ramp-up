import { Component, OnInit } from '@angular/core';
import { AuthServicesService } from '../auth/services/auth-services.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  user$;

  constructor(private authService:AuthServicesService, private router:Router){
    this.user$=this.authService.currentUser$
  }

}
