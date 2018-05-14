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

  constructor(private authService: AuthService,
              private tokenService: TokenService,
              private router: Router,
              private userService: UserService) {
  }

  signOut() {
    this.authService.signOut().subscribe(
      () => {
        localStorage.clear();
        this.router.navigate(['/sign-in']);
      }
    );
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }
}
