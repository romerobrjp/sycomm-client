import { Component, OnInit } from '@angular/core';

import { Customer } from './shared/customer.model';
import { CustomerService } from './shared/customer.service';

import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: Customer[];
  columns: any[];
  pageSizes = [25, 50, 100];
  paginator = {
    pageNumber: 0,
    perPage: this.pageSizes[0],
    offset: 0
  };
  totalCount = 0;

  public constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.listPaginated();

    this.columns = [
      { field: 'registration', header: 'Matrícula' },
      { field: 'name', header: 'Nome' },
      { field: 'email', header: 'E-mail' },
      { field: 'cpf', header: 'CPF' },
      { field: 'public_office', header: 'Cargo' },
      { field: 'public_agency', header: 'Órgão' }
    ];
  }

  listPaginated() {
    this.customerService.listPaginated(this.paginator.pageNumber, this.paginator.perPage).subscribe(
      response => {
        this.customers = response['data'];
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

  delete(customer) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: 'Deseja realmente remover este cliente?',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.customerService.delete(customer.id).subscribe(
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
