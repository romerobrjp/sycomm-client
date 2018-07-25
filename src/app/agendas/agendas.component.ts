import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { Dictionary } from '../shared/dictionary';
import { ConfirmationService } from 'primeng/api';
import { AgendaService } from './shared/agenda.service';
import { Agenda } from './shared/agenda.model';
import { ActivatedRoute , Router} from '@angular/router';

@Component({
  selector: 'app-agendas',
  templateUrl: './agendas.component.html',
  styleUrls: ['./agendas.component.css']
})
export class AgendasComponent implements OnInit {
  rows: Array<Agenda>;
  columns: any[];
  pageSizes = [10, 20, 50];
  paginator = {
    pageNumber: 0,
    perPage: this.pageSizes[0],
    offset: 0
  };
  totalCount = 0;

  constructor(
    private agendaService: AgendaService,
    public authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dictionary: Dictionary
  ) {
    this.columns = [
      { field: 'name', header: 'Nome' },
      { field: 'start_date', header: 'Data de inicio' },
      { field: 'employee_name', header: 'Atribuido a' },
    ];
  }

  ngOnInit() {
    this.listPaginated();
  }

  listPaginated() {
    if (this.authService.isAdmin()) {
      this.listAllPaginated();
    } else {
      this.listUserAgendasPaginated();
    }
  }

  listAllPaginated() {
    this.agendaService.listAllPaginated(this.paginator.pageNumber, this.paginator.perPage).subscribe(
      successResponse => {
        this.rows = successResponse.json()['data'];
        this.totalCount = successResponse.json()['total_count'];
      },
      errorResponse => {
        console.error('Ocorreu um erro ao tentar buscar as agendas: ' + errorResponse);
      }
    );
  }

  listUserAgendasPaginated() {
    this.agendaService.listUserAgendasPaginated(this.authService.getCurrentUser()['id'], this.paginator.pageNumber, this.paginator.perPage).subscribe(
      successResponse => {
        this.rows = successResponse.json()['data'];
        this.totalCount = successResponse.json()['total_count'];
      },
      errorResponse => {
        console.error('Ocorreu um erro ao tentar buscar as agendas deste usuário:' + errorResponse);
      }
    );
  }

  loadDataOnChange(event) {
    this.paginator.offset = event.first;
    this.paginator.perPage = event.rows;
    this.paginator.pageNumber = Math.ceil(this.paginator.offset / this.paginator.perPage) + 1;

    this.listPaginated();
  }
}
