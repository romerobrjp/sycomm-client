import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

import { User } from './shared/user.model';
import { UserService } from './shared/user.service';

import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[];
  columns: any[];
  adminColumns: any[];
  employeeColumns: any[];
  customerColumns: any[];
  pageSizes = [25, 50, 100];
  paginator = {
    pageNumber: 0,
    perPage: this.pageSizes[0],
    offset: 0,
    userType: ''
  };
  totalCount = 0;
  userTypesDictionary = {
    'Admin' : 'Admin',
    'Employee' : 'Funcionário',
    'Customer' : 'Cliente'
  };
  userListingType: string;

  public constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.adminColumns = [
      { field: 'name', header: 'Nome' },
      { field: 'email', header: 'E-mail' }
    ];

    this.employeeColumns = [
      { field: 'name', header: 'Nome' },
      { field: 'email', header: 'E-mail' },
      { field: 'cpf', header: 'CPF' },
      { field: 'cellphone', header: 'Celular' }
    ];

    this.customerColumns = [
      { field: 'registration', header: 'Matrícula' },
      { field: 'name', header: 'Nome' },
      { field: 'email', header: 'E-mail' },
      { field: 'cpf', header: 'CPF' },
      { field: 'role', header: 'Cargo' },
      { field: 'organization', header: 'Órgão' }
    ];

    router.events.subscribe( (event: Event) => {
      if (event instanceof NavigationStart) {
        // console.log('NavigationStart');
      }

      if (event instanceof NavigationEnd) {
        // console.log('NavigationEnd');

        this.userListingType = this.activatedRoute.snapshot.queryParamMap.get('userType');

        this.paginator.userType = this.userListingType;

        switch (this.userListingType) {
          case 'Admin': {
            this.columns = this.adminColumns;
            break;
          }
          case 'Employee': {
            this.columns = this.employeeColumns;
            break;
          }
          case 'Customer': {
            this.columns = this.customerColumns;
            break;
          }
        }

        this.listPaginated();
      }

      if (event instanceof NavigationError) {
          // Hide loading indicator
          // Present error to user
          console.error(event.error);
      }
    });
  }

  ngOnInit() {
    this.listPaginated();
  }

  listPaginated() {
    this.userService.listPaginated(this.paginator.pageNumber, this.paginator.perPage, this.paginator.userType).subscribe(
      response => {
        this.users = response['data'];
        this.totalCount = response['total_count'];
      },
      error => console.error('Ocorreu um erro ao tentar buscar os usuários:' + error)
    );
  }

  loadDataOnChange(event) {
    this.paginator.offset = event.first;
    this.paginator.perPage = event.rows;
    this.paginator.pageNumber = Math.ceil(this.paginator.offset / this.paginator.perPage) + 1;

    this.listPaginated();
  }

  delete(user) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: 'Deseja realmente remover este usuário?',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.userService.delete(user.id).subscribe(
          response => this.listPaginated()
        );
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Usuário removido!'});
      },
      reject: () => {
        return false;
      }
    });
  }

  getUsersListTitle() {
    const userType: string = this.activatedRoute.snapshot.queryParamMap.get('userType');
    let usersListTitle = '';

    switch (userType) {
      case 'admin': {
        usersListTitle = 'Administradores';
        break;
      }
      case 'employee': {
        usersListTitle = 'Funcionários';
        break;
      }
      case 'customer': {
        usersListTitle = 'Clientes';
        break;
      }
    }

    return usersListTitle;
  }
}
