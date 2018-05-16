import { Component, OnInit } from '@angular/core';

import { Admin } from './shared/admin.model';
import { AdminService } from './shared/admin.service';

import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.css']
})
export class AdminsComponent implements OnInit {
  admins: Admin[];
  columns: any[];
  pageSizes = [25, 50, 100];
  paginator = {
    pageNumber: 0,
    perPage: this.pageSizes[0],
    offset: 0
  };
  totalCount = 0;

  public constructor(
    private adminService: AdminService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.listPaginated();

    this.columns = [
      { field: 'name', header: 'Nome' },
      { field: 'email', header: 'E-mail' }
    ];
  }

  listPaginated() {
    this.adminService.listPaginated(this.paginator.pageNumber, this.paginator.perPage).subscribe(
      response => {
        this.admins = response['data'];
        this.totalCount = response['totalCount'];
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

  delete(admin) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: 'Deseja realmente remover este administrador?',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.adminService.delete(admin.id).subscribe(
          response => this.listPaginated()
        );
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Usuário removido!'});
      },
      reject: () => {
        return false;
      }
    });
  }
}
