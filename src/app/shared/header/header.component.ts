import { UserService } from './../../users/shared/user.service';
import { Component } from '@angular/core';
import { AuthService } from './../auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  currentUser;

  constructor(private authService: AuthService,
              private tokenService: TokenService,
              private router: Router,
              private userService: UserService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  signOut() {
    this.authService.signOut().subscribe(
      () => localStorage.clear()
    );
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }
}
