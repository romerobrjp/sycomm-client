import { Component, OnInit } from '@angular/core';

import { Employee } from './shared/employee.model';
import { EmployeeService } from './shared/employee.service';

import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employees: Employee[];
  columns: any[];
  pageSizes = [25, 50, 100];
  paginator = {
    pageNumber: 0,
    perPage: this.pageSizes[0],
    offset: 0
  };
  totalCount = 0;

  public constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.listPaginated();

    this.columns = [
      { field: 'name', header: 'Nome' },
      { field: 'email', header: 'E-mail' },
      { field: 'cpf', header: 'CPF' },
      { field: 'cellphone', header: 'Celular' }
    ];
  }

  listPaginated() {
    this.employeeService.listPaginated(this.paginator.pageNumber, this.paginator.perPage).subscribe(
      response => {
        this.employees = response['data'];
        this.totalCount = response['totalCount'];
      },
      error => alert('Ocorreu um erro ao tentar buscar os usuários:' + error)
    );
  }

  loadDataOnChange(event) {
    this.paginator.offset = event.first;
    this.paginator.perPage = event.rows;
    this.paginator.pageNumber = Math.ceil(this.paginator.offset / this.paginator.perPage) + 1;

    this.listPaginated();
  }

  delete(employee) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: 'Deseja realmente remover este funcionário?',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.employeeService.delete(employee.id).subscribe(
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
