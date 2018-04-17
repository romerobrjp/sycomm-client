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
  paginator = {
    page_number: 0,
    per_page: 10,
    offset: 0
  };
  total_count = 0;
  loading: boolean;

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
      { field: 'cpf', header: 'CPF' }
    ];
  }

  listPaginated() {
    this.employeeService.listPaginated(this.paginator.page_number, this.paginator.per_page).subscribe(
      response => {
        this.employees = response['data'];
        this.total_count = response['total_count'];
      },
      error => alert('Ocorreu um erro ao tentar buscar os usuários:' + error)
    );
  }

  loadDataOnChange(event) {
    this.paginator.offset = event.first;
    this.paginator.per_page = event.rows;
    this.paginator.page_number = Math.ceil(this.paginator.offset / this.paginator.per_page) + 1;

    this.listPaginated();
  }

  delete(employee) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: 'Deseja realmente remover este usuário?',
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
