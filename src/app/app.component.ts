import { Component } from '@angular/core';
import { TokenService } from './shared/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public constructor(private tokenService: TokenService) {
    this.tokenService.init({
      apiBase: 'http://api.sycomm.com:3000',
      globalOptions: {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    });
  }
}
