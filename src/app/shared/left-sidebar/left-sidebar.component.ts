import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import {User} from '../../users/shared/user.model';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css'],
  providers: [AuthService]
})
export class LeftSidebarComponent {
  constructor(private router: Router, public authService: AuthService) {}

  shouldShowAdminParentMenu() {
    return this.authService.isAdmin() || this.authService.isEmployee();
  }

  shouldShowAdminsSubmenu() {
    return this.authService.isAdmin();
  }

  shouldShowEmployeesSubmenu() {
    return this.authService.isAdmin();
  }

  shouldShowCustomersSubmenu() {
    return this.authService.isAdmin() || this.authService.isEmployee();
  }

  shouldShowAgendasMenu() {
    return this.authService.isAdmin();
  }

  shouldShowMinhasAgendasMenu() {
    return this.authService.isEmployee();
  }

  shouldShowActivitiesMenu() {
    return this.authService.isAdmin();
  }

}
