import {Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { Role } from '../../roles/shared/role.model';
import { RoleService } from '../../roles/shared/role.service';
import { Organization } from '../../organizations/shared/organization.model';
import { OrganizationService } from '../../organizations/shared/organization.service';

import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/api';

import { FormUtils} from '../../shared/form-utils';

import * as cpf_lib from '@fnando/cpf';

@Component({
  selector: 'app-user',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})

export class UserDetailComponent implements OnInit {
  user;
  roles: Role[];
  organizations: Organization[];
  form: FormGroup;
  formUtils: FormUtils;
  msgs: Message[] = [];
  userTypes: Array<Object> = [
    { value: 'Admin', text: 'Administrador'},
    { value: 'Employee', text: 'Funcionário' },
    { value: 'Customer', text: 'Cliente' }
  ];
  attributesDictionary = {
    'registration' : 'Matrícula',
    'name' : 'Nome',
    'email' : 'E-mail',
    'password' : 'Senha',
    'password_confirmation' : 'Confirmação de Senha',
    'cpf' : 'CPF',
    'landline' : 'Telefone fixo',
    'cellphone' : 'Celular',
    'whatsapp' : 'WhatsApp',
    'simples_adress' : 'Endereço',
    'type' : 'Tipo de usuário',
    'organization' : 'Organização',
    'role' : 'Cargo'
  };
  userType: string;
  // masks
  registrationMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  cpfMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  phoneMask = ['(', /\d/, /\d/, ')', ' ', /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private organizationService: OrganizationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.user = new User(
      null,
      '',
      '',
      null,
      null,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
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
      null,
      null,
      null
    );

    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: [''],
      registration: ['', Validators.required],
      cpf: ['', [Validators.required]],
      landline: [''],
      cellphone: ['', [Validators.required]],
      whatsapp: [''],
      simple_address: [''],
      role_id: [null, Validators.required],
      organization_id: [null, Validators.required],
      type: [null, Validators.required]
    });

    this.formUtils = new FormUtils(this.form);
  }

  ngOnInit() {
    this.userType = this.activatedRoute.snapshot.queryParamMap.get('userType');
    this.activatedRoute.params.switchMap(
      (params: Params) => this.userService.getById(+params['id'])
    ).subscribe(
      user => {
        if (user) {
          this.setUser(user);
        }

        this.roleService.getAll().subscribe(
          roles => {
            this.roles = roles;

            this.organizationService.getAll().subscribe(
              organizations => this.organizations = organizations,
              error => console.error('Erro ao carregar : ' + error)
            );
          },
          error => console.error('Erro ao carregar cargos: ' + error)
        );
      },
      error => console.error('Erro ao carregar o usuário: ' + error)
    );
  }

  create(): boolean {
    this.applyFormValues();

    const navigationExtras: NavigationExtras = {
      queryParams: { 'userType': this.user.type }
    };

    this.userService.create(this.user).subscribe(
      () => {
        this.router.navigate(['/users'], navigationExtras);
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Usuário criado com sucesso!'});
      },
      (error) => {
        this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro inesperado ao tentar criar o usuário.'});
        return false;
      }
    );

    return true;
  }

  update(): void {
    this.messageService.clear();
    this.applyFormValues();

    const navigationExtras: NavigationExtras = {
      queryParams: { 'userType': this.user.type }
    };

    this.userService.update(this.user).subscribe(
      (response) => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado!'})
        this.router.navigate(['/users'], navigationExtras);
      },
      (errorRseponse) => {
        for (const [key, value] of Object.entries(errorRseponse.error.errors)) {
          for (const [errorKey, errorMessage] of Object.entries(value)) {
            this.messageService.add({
              key: 'user_detail_messages',
              severity: 'error',
              summary: this.attributesDictionary[key],
              detail: errorMessage
            });
          }
        }
      }
    );
  }

  createOrUpdate() {
    if (this.user.id) {
      this.update();
    } else {
      this.create();
    }
  }

  goBack() {
    this.location.back();
  }

  isAdmin(): boolean {
    return this.userType === 'Admin';
  }

  isEmployee(): boolean {
    return this.userType === 'Employee';
  }

  isCustomer(): boolean {
    return this.userType === 'Customer';
  }

  generateBootstrapColsClasses() {
    if (this.isAdmin()) {
      return { 'col-lg-3 col-lg-offset-4' : true };
    } else if (this.isEmployee()) {
      return { 'col-lg-3 col-lg-offset-4' : true };
    } else if (this.isAdmin()) {
      return { 'col-lg-2 col-lg-offset-3' : true };
    }
  }

  currentUserIsAdmin() {
    return JSON.parse(localStorage.getItem('currentUser'))['type'] === 'Admin';
  }

  private setUser(user: User): void {
    this.user = user;
    this.form.patchValue(user);
  }

  getUserTypeName() {
    if (this.isAdmin()) {
      return 'Administrador';
    }
    if (this.isEmployee()) {
      return 'Funcionário';
    }
    if (this.isCustomer()) {
      return 'Cliente';
    }
  }

  private applyFormValues() {
    this.user.name = this.form.get('name').value;
    this.user.email = this.form.get('email').value;
    this.user.registration = this.form.get('registration').value;
    if (this.form.get('cpf').value) {
      this.user.cpf = cpf_lib.strip(this.form.get('cpf').value);
    } else {
      this.user.cpf = '';
    }
    this.user.landline = this.stripPhoneNumbers(this.form.get('landline').value);
    this.user.cellphone = this.stripPhoneNumbers(this.form.get('cellphone').value);
    this.user.whatsapp = this.stripPhoneNumbers(this.form.get('whatsapp').value);
    this.user.simple_address = this.form.get('simple_address').value;
    this.user.role_id = this.form.get('role_id').value;
    this.user.organization_id = this.form.get('organization_id').value;
  }

  private stripPhoneNumbers(phoneNumber: string) {
    if (phoneNumber) {
      return phoneNumber.replace(/\D/g, '');
    } else {
      return '';
    }
  }
}
