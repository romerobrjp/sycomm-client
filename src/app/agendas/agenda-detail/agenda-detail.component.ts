import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Message} from 'primeng/components/common/api';
import {FormUtils} from '../../shared/form-utils';
import {Location} from '@angular/common';
import {ActivatedRoute, NavigationExtras, Params, Router} from '@angular/router';
import {MessageService} from 'primeng/components/common/messageservice';
import {Agenda} from '../shared/agenda.model';
import {AgendaService} from '../shared/agenda.service';
import {AuthService} from '../../shared/auth.service';
import {Dictionary} from '../../shared/dictionary';
import {User} from '../../users/shared/user.model';
import {ErrorHandlerService} from '../../shared/error-handler.service';
import {UserService} from '../../users/shared/user.service';
import {ConfirmationService} from 'primeng/api';
import * as cpf_lib from '@fnando/cpf';
import swal from 'sweetalert2';
import {Activity} from '../../activities/shared/activity.model';
import {ActivityService} from '../../activities/shared/activity.service';

@Component({
  selector: 'app-agenda-detail',
  templateUrl: './agenda-detail.component.html',
  styleUrls: ['./agenda-detail.component.css']
})
export class AgendaDetailComponent implements OnInit {
  entity: Agenda = null;
  form: FormGroup;
  formUtils: FormUtils;
  msgs: Message[] = [];
  employee: User;
  customersCpf: Array<string> = [];
  customers: Array<User> = [];
  employees: Array<User> = [];
  cpfMask = FormUtils.cpfMask;

  agendaActivities: Array<Activity>;
  activitiesTableColumns: any[];
  activitiesTablePageSizes = [10, 20, 50];
  activitiesTablePaginator = {
    pageNumber: 0,
    perPage: this.activitiesTablePageSizes[0],
    offset: 0
  };
  activitiesTotalCount = 0;

  constructor(
    public authService: AuthService,
    private agendaService: AgendaService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private activityService: ActivityService,
    public dictionary: Dictionary,
    private confirmationService: ConfirmationService
  ) {
    this.entity = new Agenda(
      null,
      '',
      null,
      null,
      null,
      null,
      [],
      [],
      null,
      null,
      null,
      null
    );

    this.form = this.formBuilder.group({
      name: [{value : '', disabled: !this.authService.isAdmin()}, Validators.required],
      start_date: [{value : null, disabled: !this.authService.isAdmin()}],
      end_date: [{value : null, disabled: !this.authService.isAdmin()}],
      employee_id: [{value : null, disabled: !this.authService.isAdmin()}, Validators.required],
      customers_cpf: [{value : '', disabled: !this.authService.isAdmin()}, Validators.required],
      currentCpf: [''],
    });

    this.formUtils = new FormUtils(this.form);

    this.activitiesTableColumns = [
      { field: 'name', header: 'Nome' },
      { field: 'status', header: 'Status' },
      { field: 'agenda.start_date', header: 'Data' },
      { field: 'description', header: 'Descrição' },
      { field: 'activity_type', header: 'Tipo' },
      { field: 'customer_name', header: 'Cliente' },
      { field: 'annotations', header: 'Anotações' },
    ];
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          this.agendaService.getById(+params['id']).subscribe(
            (responseSuccess) => {
              this.setEntity(responseSuccess);
              this.customers = this.entity.customers;
              this.customersCpf = this.customers.map( c => c.cpf);
              this.loadAgendaActivities();
            },
            responseError => {
              console.error('Erro ao tentar carregar agenda: ' + responseError);
            }
          );
        }

        this.userService.listBytype('Employee').subscribe(
          (success) => this.employees = success,
          (error) => ErrorHandlerService.handleResponseErrors(error)
        );
      }
    );
  }

  loadAgendaActivities() {
    this.activityService.listByAgendaPaginated(this.entity.id, this.activitiesTablePaginator.pageNumber, this.activitiesTablePaginator.perPage).subscribe(
      successResponse => {
        this.agendaActivities = successResponse.json()['data'];
        this.activitiesTotalCount = successResponse.json()['total_count'];
      },
      errorResponse => {
        console.error('Ocorreu um erro ao tentar buscar as atividades: ' + errorResponse);
      }
    );
  }

  setEntity(e: Agenda) {
    this.entity = e;
    this.form.patchValue(e);
  }

  goBack() {
    this.location.back();
  }

  create(): boolean {
    this.applyFormValues();

    this.agendaService.create(this.entity).subscribe(
      () => {
        this.router.navigate(['/agendas']);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Agenda criada' });
      },
      (error) => {
        this.messageService.clear();
        this.messageService.add({ severity: 'error', summary: undefined, detail: error.json().errors });
        this.messageService.add({
          key: 'agenda_detail_messages',
          severity: 'error',
          summary: '',
          detail: error.json().errors
        });
        return false;
      }
    );

    return true;
  }

  update(): void {
    this.messageService.clear();
    this.applyFormValues();

    this.agendaService.update(this.entity).subscribe(
      () => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Agenda atualizada'});
      },
      (errorResponse) => {
        if (errorResponse.error && errorResponse.error.errors) {
          for (const [key, value] of Object.entries(errorResponse.error.errors)) {
            for (const [errorKey, errorMessage] of Object.entries(value)) {
              this.messageService.add({
                key: 'agenda_detail_messages',
                severity: 'error',
                summary: Agenda.attributesDictionary[key],
                detail: errorMessage
              });
            }
          }
        } else {
          this.messageService.clear();
          this.messageService.add({ severity: 'error', summary: undefined, detail: errorResponse.json().errors });
          this.messageService.add({
            key: 'agenda_detail_messages',
            severity: 'error',
            summary: '',
            detail: errorResponse.json().errors
          });
        }
      }
    );
  }

  createOrUpdate() {
    if (this.entity.id) {
      this.update();
    } else {
      this.create();
    }
  }

  applyFormValues() {
    this.entity.name = this.form.get('name').value;
    this.entity.start_date = this.form.get('start_date').value;
    this.entity.end_date = this.form.get('end_date').value;
    this.entity.employee_id = +this.form.get('employee_id').value;
    this.entity.customers_cpf = this.customersCpf.map( cpf => cpf_lib.strip(cpf));
  }

  addCpf() {
    const currentCpf: string = cpf_lib.strip(this.form.get('currentCpf').value);

    if (!cpf_lib.isValid(currentCpf)) {
      swal('Erro', 'Por favor, informe um CPF válido!', 'error');
      return false;
    } else if (this.customersCpf.includes(currentCpf)) {
      swal('Ops...', 'Este CPF já foi incluído, escolha outro.', 'warning');
      return false;
    } else if (currentCpf && currentCpf.length === 11) {
      let user: User;

      this.userService.getByCpf(currentCpf).subscribe(
        (retrievedUser) => {
          user = retrievedUser;
          this.customers.push(user);
          this.customersCpf.push(user.cpf);
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Cliente adicionado'});
        },
        (reponseError) => {
          if (reponseError.status === 404) {
            swal('Erro', 'Nenhum cliente cadastrado com este CPF.', 'error');
          }
          console.error('Erro ao buscar usuário por CPF');
        }
      );
    }

    this.form.get('currentCpf').reset();
  }

  clearCpfs() {
    this.customersCpf = [];
    this.customers = [];
    this.entity.customers = [];
    this.entity.customers_cpf = [];
  }

  removeCpf(event, cpf) {
    this.customersCpf.splice(this.customersCpf.indexOf(cpf), 1);
    const customerWithCpf: User = this.customers.filter((c: User) => (c.cpf === cpf))[0];
    this.customers.splice(this.customers.indexOf(customerWithCpf), 1);
  }

  getNameAndSurname(fullName: string) {
    let nameSurname: string;

    if (fullName) {
      const splittedFullname: string[] = fullName.split(' ');

      if (splittedFullname.length > 1) {
        nameSurname = splittedFullname[0] + ' ' + splittedFullname[splittedFullname.length - 1];
      } else {
        nameSurname = fullName;
      }
    }

    return nameSurname;
  }

  goToCustomerConfirmation(event, customerId) {
    event.preventDefault();
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: 'As alterações feitas nao foram salvas, se sair desta página os dados serão perdidos. Continuar?',
      icon: 'fa fa-question-circle',
      accept: () => {
        const navigationExtras: NavigationExtras = {
          queryParams: { 'userType': 'Customer' }
        };
        this.router.navigate(['/users', customerId], navigationExtras);
      },
      reject: () => {
        return false;
      }
    });
  }

  // activities
  loadActivitiesOnChange(event) {
    this.activitiesTablePaginator.offset = event.first;
    this.activitiesTablePaginator.perPage = event.rows;
    this.activitiesTablePaginator.pageNumber = Math.ceil(this.activitiesTablePaginator.offset / this.activitiesTablePaginator.perPage) + 1;

    this.loadAgendaActivities();
  }

  deleteActivity(activity) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: `Deseja realmente remover a atividade "${activity.name}"?`,
      icon: 'fa fa-question-circle',
      accept: () => {
        this.activityService.delete(activity.id).subscribe(
          () => this.loadAgendaActivities()
        );
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Atividade removida!'});
      },
      reject: () => {
        return false;
      }
    });
  }
}
