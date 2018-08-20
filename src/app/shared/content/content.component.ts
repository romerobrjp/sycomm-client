import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

  shouldHideSidebar() {
    return !this.authService.userSignedIn();
  }
}
