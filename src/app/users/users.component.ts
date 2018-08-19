import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Event, NavigationStart, NavigationEnd, NavigationError, Params} from '@angular/router';

import { User } from './shared/user.model';
import { UserService } from './shared/user.service';

import { MessageService } from 'primeng/components/common/messageservice';
import {ConfirmationService, LazyLoadEvent} from 'primeng/api';
import { CpfPipe, TelefonePipe } from 'ng2-brpipes';
import {GeneralUtils} from '../shared/general-utils';
import {DataTable} from 'primeng/primeng';
import 'rxjs-compat/add/operator/filter';
import {Dictionary} from '../shared/dictionary';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[];
  columns: any[];
  adminColumns: any[];
  employeeColumns: any[];
  customerColumns: any[];
  pageSizes = [10, 25, 50, 100];
  paginator = {
    pageNumber: 0,
    perPage: this.pageSizes[0],
    offset: 0,
    userType: '',
    sortField: 'name',
    sortOrder: 'asc',
    searchField: '',
    searchText: ''
  };
  totalCount = 0;
  userListingType: string;
  @ViewChild('usersTable') usersTable: DataTable;

  private cpfPipe: CpfPipe;
  private telefonePipe: TelefonePipe;
  private sub: any;

  public constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dictionary: Dictionary
  ) {
    this.cpfPipe = new CpfPipe();
    this.telefonePipe = new TelefonePipe();

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
      { field: 'cellphone', header: 'Telefone' },
      { field: 'public_office', header: 'Cargo' },
      { field: 'public_agency', header: 'Órgão' }
    ];

    this.sub = this.router.events.filter(event => event instanceof NavigationEnd).subscribe(
      (event: NavigationEnd) =>  {
        if (event.url.includes('users')) {
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
      }
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  listPaginated() {
    this.userService.listPaginated(this.paginator.pageNumber,
                                   this.paginator.perPage,
                                   this.paginator.userType,
                                   this.paginator.sortField,
                                   this.paginator.sortOrder,
                                   this.paginator.searchField,
                                   this.paginator.searchText).subscribe(
      response => {
        this.users = response['data'];
        this.totalCount = response['total_count'];
        if (document.getElementById('go_to_page_input')) { document.getElementById('go_to_page_input')['value'] = this.paginator.pageNumber; }
      },
      error => console.error('Ocorreu um erro ao tentar buscar os usuários:' + error)
    );
  }

  loadDataOnChange(event: LazyLoadEvent) {
    this.paginator.offset = event.first;
    this.paginator.perPage = event.rows;
    this.paginator.pageNumber = Math.ceil(this.paginator.offset / this.paginator.perPage) + 1;
    if (event.sortField) { this.paginator.sortField = event.sortField; }
    this.paginator.sortOrder = GeneralUtils.sortOrderDictionary.get(event.sortOrder);
    if (document.getElementById('go_to_page_input')) { document.getElementById('go_to_page_input')['value'] = this.paginator.pageNumber; }

    this.listPaginated();
  }

  handleFilter(event: any) {
    this.paginator.searchField = event.srcElement.name;
    this.paginator.searchText = event.target.value;

    this.listPaginated();
  }

  changePageNumber(event) {
    let pageNumber = +event.srcElement.value;
    const totalPagesNumber = Math.ceil(this.totalCount / this.paginator.perPage);

    if (pageNumber < 1) {
      pageNumber = 1;
    }
    else if (pageNumber > totalPagesNumber) {
      pageNumber = totalPagesNumber;
    }

    this.usersTable.first = (pageNumber - 1) * this.usersTable.rows;
    this.paginator.offset = this.usersTable.first;
    this.paginator.perPage = this.usersTable.rows;
    this.paginator.pageNumber = pageNumber;

    this.listPaginated();
  }

  delete(user) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: `Deseja realmente remover o ${this.dictionary.userTypes[user.type]} '${user.name}'?`,
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
      case 'Admin': {
        usersListTitle = 'Administradores';
        break;
      }
      case 'Employee': {
        usersListTitle = 'Funcionários';
        break;
      }
      case 'Customer': {
        usersListTitle = 'Clientes';
        break;
      }
    }

    return usersListTitle;
  }

  formatColValueWithPipe(colField, colValue): string {
    let result: string;

    switch (colField) {
      case 'cpf': {
        result = this.cpfPipe.transform(colValue);
        break;
      }
      case 'cellphone' || 'landline' || 'whatsapp': {
        result = this.telefonePipe.transform(colValue);
        break;
      }
      default: {
        result = colValue;
        break;
      }
    }

    return result;
  }
}
