import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent {
  currentUser;

  constructor(private router: Router, private authService: AuthService) {}

  isAdmin() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.currentUser.type === 'Admin';
  }
}
