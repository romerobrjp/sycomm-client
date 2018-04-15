import { Component, OnInit } from '@angular/core';

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
  paginator = {
    page_number: 0,
    per_page: 10,
    offset: 0
  };
  total_count = 0;
  loading: boolean;

  public constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.getPaginated();

    this.columns = [
      { field: 'registration', header: 'Matrícula' },
      { field: 'name', header: 'Nome' },
      { field: 'email', header: 'E-mail' },
      { field: 'cpf', header: 'CPF' },
      { field: 'role', header: 'Cargo' },
      { field: 'organization', header: 'Órgão' }
    ];
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

  loadDataOnChange(event) {
    this.paginator.offset = event.first;
    this.paginator.per_page = event.rows;
    this.paginator.page_number = Math.ceil(this.paginator.offset / this.paginator.per_page) + 1;

    this.getPaginated();
  }

  delete(user) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: 'Deseja realmente remover este usuário?',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.userService.delete(user.id).subscribe(
          response => this.getPaginated()
        );
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Usuário removido!'});
      },
      reject: () => {
        return false;
      }
    });
  }
}
