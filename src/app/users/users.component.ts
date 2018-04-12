import { Component, OnInit, AfterViewInit } from '@angular/core';

import { User } from './shared/user';
import { UserService } from './shared/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {
  users: User[];
  columns: any[];
  paginator = {
    page_number: 0,
    per_page: 10,
    offset: 0
  };
  total_count = 0;
  loading: boolean;

  public constructor(private userService: UserService) {}

  ngOnInit() {
    this.getPaginated();

    this.columns = [
      { field: 'registration', header: 'Matrícula' },
      { field: 'name', header: 'Nome' },
      { field: 'email', header: 'E-mail' },
      { field: 'cpf', header: 'CPF' },
      { field: 'role', header: 'Cargo' },
      { field: 'organization', header: 'Organização' }
    ];
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
  }

  getPaginated() {
    this.userService.getAllPaginated(this.paginator.page_number, this.paginator.per_page).subscribe(
      response => {
        this.users = response['data'];
        this.total_count = response['total_count'];
      },
      error => alert('Ocorreu um erro ao tentar buscar os usuários:' + error)
    );
  }

  public loadDataOnChange(event) {
    this.paginator.offset = event.first;
    this.paginator.per_page = event.rows;
    this.paginator.page_number = Math.ceil(this.paginator.offset / this.paginator.per_page) + 1;

    this.getPaginated();
  }
}
