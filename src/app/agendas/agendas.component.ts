import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { Dictionary } from '../shared/dictionary';
import { ConfirmationService } from 'primeng/api';
import { AgendaService } from './shared/agenda.service';
import { Agenda } from './shared/agenda.model';
import { ActivatedRoute , Router} from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-agendas',
  templateUrl: './agendas.component.html',
  styleUrls: ['./agendas.component.css']
})
export class AgendasComponent implements OnInit {
  rows: Array<Agenda>;
  columns: any[];
  pageSizes = [10, 20, 50, 100];
  paginator = {
    pageNumber: 0,
    perPage: this.pageSizes[0],
    offset: 0
  };
  totalCount = 0;
  openActivitiesCount = 0;
  selectedAgendas: Agenda[] = [];
  selectedAgendasIds: Array<number> = [];

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
      { field: 'start_date', header: 'Data de início' },
      { field: 'end_date', header: 'Data de término' },
      { field: 'activities', header: 'Atividades' },
      { field: 'open_activities_count', header: 'Atividades em aberto' },
      { field: 'customers', header: 'Número de Clientes' },
    ];
  }

  ngOnInit() {}

  listPaginated() {
    if (this.authService.isAdmin()) {
      this.listAllPaginated();
    } else {
      this.listEmployeeAgendasPaginated();
    }
  }

  listAllPaginated() {
    this.agendaService.listAllPaginated(this.paginator.pageNumber, this.paginator.perPage).subscribe(
      successResponse => {
        this.rows = successResponse['data'];
        this.totalCount = successResponse['total_count'];
      },
      errorResponse => {
        console.error('Ocorreu um erro ao tentar buscar as agendas: ' + errorResponse);
      }
    );
  }

  listEmployeeAgendasPaginated() {
    // this.agendaService.listEmployeeAgendasPaginated(this.authService.getCurrentUser()['id'], this.paginator.pageNumber, this.paginator.perPage).subscribe(
    //   successResponse => {
    //     this.rows = successResponse['data'];
    //     this.totalCount = successResponse['total_count'];
    //   },
    //   errorResponse => {
    //     console.error('Ocorreu um erro ao tentar buscar as agendas deste usuário:' + errorResponse);
    //   }
    // );
  }

  loadDataOnChange(event) {
    this.paginator.offset = event.first;
    this.paginator.perPage = event.rows;
    this.paginator.pageNumber = Math.ceil(this.paginator.offset / this.paginator.perPage) + 1;

    this.listPaginated();
  }

  delete(entity) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: 'Caso esta agenda possua atividades, elas também serão excluídas. Prosseguir?',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.agendaService.delete(entity.id).subscribe(
          () => {
            this.listPaginated();
            this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Agenda removida!'});
          }
        );
      },
      reject: () => {
        return false;
      }
    });
  }

  deleteAllInprogress() {
    //   if (this.selectedAgendas && this.selectedAgendas.length > 0) {
    //     const agendasIDs: Array<number> = this.selectedAgendas.map(agenda => agenda.id);

    //     swal({ title: `${this.selectedAgendas.length} agendas selecionadas.`, text: `Caso alguma das agendas selecionadas possua atividades, elas também serão excluídas. Prosseguir?`, type: 'warning', showCancelButton: true }).then(
    //       result => {
    //         if (result.value) {
    //           this.agendaService.deleteAgendas(agendasIDs).subscribe(
    //             () => {
    //               this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Agendas removidas!'});
    //               this.listAllPaginated();
    //             },
    //             (responseError) => {
    //               this.messageService.add({severity: 'error', summary: 'Erro', detail: responseError});
    //             },
    //             () => {
    //               this.selectedAgendas = [];
    //             }
    //           );
    //         } else {
    //           return false;
    //         }
    //       }
    //     );
    //   } else {
    //     swal('Aviso', 'Selecione ao menos uma agenda para realizar esta ação.', 'warning');
    //     return false;
    //   }
  }

  deleteSelected() {
    if (this.selectedAgendas && this.selectedAgendas.length > 0) {
      const agendasIDs: Array<number> = this.selectedAgendas.map(agenda => agenda.id);

      swal({ title: `${this.selectedAgendas.length} agendas selecionadas.`, text: `Caso alguma das agendas selecionadas possua atividades, elas também serão excluídas. Prosseguir?`, type: 'warning', showCancelButton: true }).then(
        result => {
          if (result.value) {
            this.agendaService.deleteAgendas(agendasIDs).subscribe(
              () => {
                this.messageService.add({severity: 'success', summary: 'Sucesso', detail: `${this.selectedAgendas.length} Agendas removidas!` });
                this.listAllPaginated();
              },
              (responseError) => {
                this.messageService.add({severity: 'error', summary: 'Erro', detail: responseError});
              },
              () => {
                this.selectedAgendas = [];
              }
            );
          } else {
            return false;
          }
        }
      );
    } else {
      swal('Aviso', 'Selecione ao menos uma agenda para realizar esta ação.', 'warning');
      return false;
    }
  }

  deleteSelected() {
    if (this.selectedAgendas && this.selectedAgendas.length > 0) {
      const agendasIDs: Array<number> = this.selectedAgendas.map(agenda => agenda.id);

      swal({ title: `${this.selectedAgendas.length} agendas selecionadas.`, text: `Caso alguma das agendas selecionadas possua atividades, elas também serão excluídas. Prosseguir?`, type: 'warning', showCancelButton: true }).then(
        result => {
          if (result.value) {
            this.agendaService.deleteAgendas(agendasIDs).subscribe(
              () => {
                this.messageService.add({severity: 'success', summary: 'Sucesso', detail: `${this.selectedAgendas.length} Agendas removidas!` });
                this.listAllPaginated();
              },
              (responseError) => {
                this.messageService.add({severity: 'error', summary: 'Erro', detail: responseError});
              },
              () => {
                this.selectedAgendas = [];
              }
            );
          } else {
            return false;
          }
        }
      );
    } else {
      swal('Aviso', 'Selecione ao menos uma agenda para realizar esta ação.', 'warning');
      return false;
    }
  }
}
