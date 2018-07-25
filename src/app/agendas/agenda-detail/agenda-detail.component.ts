import {switchMap} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Message} from 'primeng/components/common/api';
import {FormUtils} from '../../shared/form-utils';
import {Location} from '@angular/common';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MessageService} from 'primeng/components/common/messageservice';
import {Agenda} from '../shared/agenda.model';
import {AgendaService} from '../shared/agenda.service';
import {AuthService} from '../../shared/auth.service';
import {Dictionary} from '../../shared/dictionary';
import {User} from '../../users/shared/user.model';
import {ErrorHandlerService} from '../../shared/error-handler.service';
import {UserService} from '../../users/shared/user.service';
import * as cpf_lib from '@fnando/cpf';

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
  employees: User[] = [];
  cpfMask = FormUtils.cpfMask;

  constructor(
    public authService: AuthService,
    private agendaService: AgendaService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    public dictionary: Dictionary,
  ) {
    this.entity = new Agenda(
      null,
      '',
      null,
      null,
      null,
      null,
      null
    );

    this.form = this.formBuilder.group({
      name: [{value : '', disabled: !this.authService.isAdmin()}, Validators.required],
      start_date: [{value : null, disabled: !this.authService.isAdmin()}],
      employee_id: [{value : null, disabled: !this.authService.isAdmin()}, Validators.required],
      customers_cpf: [{value : '', disabled: !this.authService.isAdmin()}, Validators.required],
      currentCpf: [''],
    });

    this.formUtils = new FormUtils(this.form);
  }

  ngOnInit() {
    this.activatedRoute.params.pipe(switchMap(
      (params: Params) => this.agendaService.getById(+params['id'])
    )).subscribe(
      responseSuccess => {
        if (responseSuccess) {
          this.setEntity(responseSuccess);
        } else {
          console.error('Erro ao tentar carrgera agenda: ' + responseSuccess);
        }
      },
      responseError => {
        console.error('Erro ao tentar carrgera agenda: ' + responseError);
      }
    );

    this.userService.listBytype('Employee').subscribe(
      (success) => this.employees = success,
      (error) => {
        ErrorHandlerService.handleResponseErrors(error);
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

  private create(): boolean {
    this.applyFormValues();

    this.agendaService.create(this.entity).subscribe(
      () => {
        this.router.navigate(['/activities']);
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Agenda criada'});
      },
      (error) => {
        this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro inesperado ao tentar criar a agenda.'});
        return false;
      }
    );

    return true;
  }

  private update(): void {
    this.messageService.clear();
    this.applyFormValues();

    this.agendaService.update(this.entity).subscribe(
      (response) => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Agenda atualizada'});
      },
      (errorRseponse) => {
        for (const [key, value] of Object.entries(errorRseponse.error.errors)) {
          for (const [errorKey, errorMessage] of Object.entries(value)) {
            this.messageService.add({
              key: 'agenda_detail_messages',
              severity: 'error',
              summary: Agenda.attributesDictionary[key],
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
    this.entity.start_date = this.form.get('start_date').value;
    this.entity.employee_id = +this.form.get('employee_id').value;
    this.entity.customers_cpf = this.customersCpf.map( cpf => cpf_lib.strip(cpf));
  }

  private addCpf() {
    let currentCpf: string = this.form.get('currentCpf').value;

    if (!cpf_lib.isValid(currentCpf)) {
      alert('Por favor, informe um CPF valido!');
      return false;
    }
    else if (this.customersCpf.includes(currentCpf)) {
      alert('Este CPF ja foi incluido, escolha outro.');
      return false;
    }
    else if (currentCpf && cpf_lib.strip(currentCpf).length === 11) {
      this.customersCpf.push(currentCpf);
    }

    this.form.get('currentCpf').reset();
  }

  private clearCpfs() {
    this.customersCpf = [];
  }

  private removeCpf(event, cpf) {
    this.customersCpf.splice(this.customersCpf.indexOf(cpf), 1);
  }
}
