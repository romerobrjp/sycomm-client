import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import {User} from '../../users/shared/user.model';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent {
  constructor(private router: Router, private authService: AuthService) {}

  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  isAdmin() {
    return this.getCurrentUser().type === 'Admin';
  }

  isEmployee(): boolean {
    return this.getCurrentUser().type === 'Employee';
  }

  isCustomer(): boolean {
    return this.getCurrentUser().type === 'Customer';
  }
}
