import {Component, OnInit, ViewChild} from '@angular/core';
import {Dictionary} from '../shared/dictionary';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../shared/auth.service';
import {MessageService} from 'primeng/components/common/messageservice';
import {ConfirmationService, LazyLoadEvent} from 'primeng/api';
import {PublicAgencyService} from './shared/public-agency.service';
import {GeneralUtils} from '../shared/general-utils';
import {DataTable} from 'primeng/primeng';
import {PublicAgency} from './shared/public-agency.model';

@Component({
  selector: 'app-public_agencies',
  templateUrl: './public-agencies.component.html',
  styleUrls: ['./public-agencies.component.css']
})
export class PublicAgenciesComponent implements OnInit {
  rows: Array<PublicAgency>;
  columns: any[];
  pageSizes = [10, 20, 50, 100];
  paginator = {
    pageNumber: 0,
    perPage: this.pageSizes[0],
    offset: 0,
    sortField: 'name',
    sortOrder: 'asc',
    searchField: '',
    searchText: ''
  };
  totalCount = 0;
  @ViewChild('modelsTable') modelsTable: DataTable;

  constructor(
    private publicAgencyService: PublicAgencyService,
    public authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dictionary: Dictionary
  ) {
    this.columns = [
      { field: 'name', header: 'Nome' },
      { field: 'description', header: 'Descrição' },
    ];
  }

  ngOnInit() {}

  listPaginated() {
    this.publicAgencyService.listPaginated(this.paginator.pageNumber,
                                           this.paginator.perPage,
                                           this.paginator.sortField,
                                           this.paginator.sortOrder,
                                           this.paginator.searchField,
                                           this.paginator.searchText).subscribe(
      (response) => {
        this.rows = response.json()['data'];
        this.totalCount = response.json()['total_count'];
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

    this.modelsTable.first = (pageNumber - 1) * this.modelsTable.rows;
    this.paginator.offset = this.modelsTable.first;
    this.paginator.perPage = this.modelsTable.rows;
    this.paginator.pageNumber = pageNumber;

    this.listPaginated();
  }

  delete(model: PublicAgency) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: `Deseja realmente remover este o órgão "${model.name}"?`,
      icon: 'fa fa-question-circle',
      accept: () => {
        this.publicAgencyService.delete(model.id).subscribe(
          response => this.listPaginated()
        );
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Registro removido!'});
      },
      reject: () => {
        return false;
      }
    });
  }
}
