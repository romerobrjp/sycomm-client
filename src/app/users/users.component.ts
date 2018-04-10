import { Component, OnInit, AfterViewInit } from '@angular/core';

import { User } from './shared/user';
import { UserService } from './shared/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {
  public users: User[];

  public constructor(private userService: UserService) {}

  public ngOnInit() {
    this.userService.getAll().subscribe(
      users => {
        this.users = users;
      },
      error => alert('Ocorreu um erro ao tentar buscar os usuários:' + error)
    );
    console.log(this.users);
  }

  public ngAfterViewInit() {
    $('#users_table').DataTable();
  }
}
