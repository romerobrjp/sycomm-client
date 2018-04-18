import {Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { Employee } from '../shared/employee.model';
import { EmployeeService } from '../shared/employee.service';

import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/api';

import { FormUtils} from '../../shared/form-utils';

import * as cpf from '@fnando/cpf'; // import the whole library

@Component({
  selector: 'app-employee',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})

export class EmployeeDetailComponent implements OnInit, OnChanges {
  employee: Employee;
  form: FormGroup;
  formUtils: FormUtils;
  msgs: Message[] = [];
  cpfMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  phoneMask = ['(', /\d/, /\d/, ')', ' ', /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.employee = new Employee(
      null,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Employee',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );

    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      email: [null],
      cpf: [null, [Validators.required]],
      landline: [null],
      cellphone: [null, [Validators.required]],
      whatsapp: [null],
      simple_address: [null]
    });

    this.formUtils = new FormUtils(this.form);
  }

  ngOnInit() {
    this.route.params.switchMap(
      (params: Params) => this.employeeService.getById(+params['id'])
    ).subscribe(
      employee => {
        if (employee) {
          this.setEmployee(employee);
        }
      },
      error => console.error('Erro ao carregar o usuário: ' + error)
    );
  }

  create() {
    this.applyFormValues();

    this.employeeService.create(this.employee).subscribe(
      () => this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Usuário criado com sucesso!'}),
      (error) => this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro inesperado ao tentar criar o usuário.'})
    );

    this.router.navigate(['/employees']);
  }

  update() {
    this.applyFormValues();

    let errorFound = false;

    if (!cpf.isValid(this.employee.cpf)) {
      this.messageService.add({severity: 'error', summary: 'Erro', detail: 'CPF inválido.'});
      errorFound = true;
    }

    if (this.employee.cellphone && this.employee.cellphone.length !== 11) {
      this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Celular precisa ter 11 dígitos.'});
      errorFound = true;
    }

    if (this.employee.whatsapp && this.employee.whatsapp.length !== 11) {
      this.messageService.add({severity: 'error', summary: 'Erro', detail: 'WhatsApp precisa ter 11 dígitos.'});
      errorFound = true;
    }

    if (errorFound) { return false; };

    this.employeeService.update(this.employee).subscribe(
      (response) => this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado!'}),
      (errorRseponse) => this.messageService.add({severity: 'error', summary: 'Erro', detail: errorRseponse.error.errors.cellphone[0]})
    );
  }

  createOrUpdate() {
    if (this.employee.id) {
      this.update();
    } else {
      this.create();
    }

    this.router.navigate(['/employees']);
  }

  public goBack() {
    this.location.back();
  }

  private setEmployee(employee: Employee): void {
    this.employee = employee;
    this.form.patchValue(employee);
  }

  private applyFormValues() {
    if (this.form.get('name').value) { this.employee.name = this.form.get('name').value; }
    if (this.form.get('email').value) { this.employee.email = this.form.get('email').value; }
    if (this.form.get('cpf').value) { this.employee.cpf = cpf.strip(this.form.get('cpf').value).match(/\d+/g).join([]); }
    if (this.form.get('cellphone').value) { this.employee.cellphone = this.form.get('cellphone').value.match(/\d+/g).join([]); }
    if (this.form.get('whatsapp').value) { this.employee.whatsapp = this.form.get('whatsapp').value.match(/\d+/g).join([]); }
    if (this.form.get('simple_address').value) { this.employee.simple_address = this.form.get('simple_address').value; }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
