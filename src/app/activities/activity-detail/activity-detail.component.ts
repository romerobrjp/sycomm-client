
import {switchMap} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Message} from 'primeng/components/common/api';
import {FormUtils} from '../../shared/form-utils';
import {Location} from '@angular/common';
import {ActivatedRoute, NavigationExtras, Params, Router} from '@angular/router';
import {MessageService} from 'primeng/components/common/messageservice';
import {Activity} from '../shared/activity.model';
import {ActivityService} from '../shared/activity.service';
import {AuthService} from '../../shared/auth.service';
import {Dictionary} from '../../shared/dictionary';
import {UserService} from '../../users/shared/user.service';
import {ErrorHandlerService} from '../../shared/error-handler.service';
import {User} from '../../users/shared/user.model';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.css']
})
export class ActivityDetailComponent implements OnInit {
  entity: Activity = null;
  form: FormGroup;
  formUtils: FormUtils;
  msgs: Message[] = [];
  employees: User[];
  agendaCustomers: User[] = [];
  customer: User;
  agendaId: number;

  constructor(
    public authService: AuthService,
    private activityService: ActivityService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    public dictionary: Dictionary,
    private userService: UserService,
    private confirmationService: ConfirmationService
  ) {
    this.entity = new Activity(
      null,
      '',
      '',
      '',
      null,
      null,
      null,
      null,
      '',
      null,
      null,
      null,
      null
    );

    this.form = this.formBuilder.group({
      name: [{value : '', disabled: !this.authService.isAdmin()}, Validators.required],
      description: [{value : '', disabled: !this.authService.isAdmin()}],
      annotations: [''],
      activity_type: [{value : null, disabled: !this.authService.isAdmin()}, Validators.required],
      status: [{value: null, disabled: !this.authService.isAdmin() || (!this.authService.isAdmin() && this.entity.status === 1)}, [Validators.required]],
      employee_id: [{value : null, disabled: !this.authService.isAdmin()}, Validators.required],
      customer_id: [{value : null, disabled: !this.authService.isAdmin()}, Validators.required],
    });

    this.formUtils = new FormUtils(this.form);
  }

  ngOnInit() {
    this.agendaId = +this.activatedRoute.snapshot.queryParamMap.get('agendaId');

    this.activatedRoute.params.pipe(switchMap(
      (params: Params) => this.activityService.getById(+params['id'])
    )).subscribe(
      responseSuccess => {
        if (responseSuccess) {
          this.setEntity(responseSuccess);

          if (this.agendaId) {
            this.userService.listCustomersByAgenda(this.entity.agenda.id).subscribe(
              (success) => {
                this.agendaCustomers = success;
              },
              (error) => {
                ErrorHandlerService.handleResponseErrors(error);
              }
            );
          }
        }
      },
      responseError => {
        console.error('Erro ao tentar carrgera atividade: ' + responseError);
      }
    );

    this.userService.listBytype('Employee').subscribe(
      (success) => {
        this.employees = success;
      },
      (error) => {
        ErrorHandlerService.handleResponseErrors(error);
      }
    );
  }

  setEntity(e: Activity) {
    this.entity = e;
    this.form.patchValue(e);
  }

  goBack() {
    this.location.back();
  }

  goToCustomerConfirmation(event, customerId) {
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

  private create(): boolean {
    this.applyFormValues();

    this.activityService.create(this.entity).subscribe(
      () => {
        this.router.navigate(['/activities']);
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Atividade criada'});
      },
      () => {
        this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro inesperado ao tentar criar a atividade.'});
        return false;
      }
    );

    return true;
  }

  private update(): void {
    this.messageService.clear();
    this.applyFormValues();

    this.activityService.update(this.entity).subscribe(
      () => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Atividade atualizada'});
      },
      (errorRseponse) => {
        for (const [key, value] of Object.entries(errorRseponse.error.errors)) {
          for (const [errorKey, errorMessage] of Object.entries(value)) {
            this.messageService.add({
              key: 'activity_detail_messages',
              severity: 'error',
              summary: Activity.attributesDictionary[key],
              detail: errorMessage
            });
          }
        }
      }
    );
  }

  private createOrUpdate() {
    if (this.entity.id) {
      this.update();
    } else {
      this.create();
    }
  }

  private applyFormValues() {
    this.entity.name = this.form.get('name').value;
    this.entity.description = this.form.get('description').value;
    this.entity.annotations = this.form.get('annotations').value;
    this.entity.status = this.form.get('status').value;
    this.entity.activity_type = this.form.get('activity_type').value;
    this.entity.employee_id = +this.form.get('employee_id').value;
    this.entity.customer_id = +this.form.get('customer_id').value;
  }
}
