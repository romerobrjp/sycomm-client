import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-control-sidebar',
  templateUrl: './control-sidebar.component.html',
  styleUrls: ['./control-sidebar.component.css']
})
export class ControlSidebarComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

}
