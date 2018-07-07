import { Component } from '@angular/core';
import { TokenService } from './shared/token.service';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private tokenService: TokenService, private authService: AuthService) {
    this.tokenService.init({
      apiBase: 'http://api.sycomm.com:3000',
      globalOptions: {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.sycomm.v1'
        }
      }
    });

    // this.authService.refreshCurrentUser();
  }
}
