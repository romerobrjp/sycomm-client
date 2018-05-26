import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser;
  userTypesDictionary = {
    'Admin' : 'Admin',
    'Employee' : 'Funcionário',
    'Customer' : 'Cliente'
  };

  constructor() { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  getCurrentUser() {
    // return JSON.parse(localStorage.getItem('currentUser'));
  }
}
