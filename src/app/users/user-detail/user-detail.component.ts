import {Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
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

import * as cpf from '@fnando/cpf'; // import the whole library

@Component({
  selector: 'app-user',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})

export class UserDetailComponent implements OnInit, OnChanges {
  user: User;
  roles: Role[];
  organizations: Organization[];
  form: FormGroup;
  formUtils: FormUtils;
  msgs: Message[] = [];
  registrationMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  cpfMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  phoneMask = ['(', /\d/, /\d/, ')', ' ', /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(
    private userService: UserService, private roleService: RoleService, private organizationService: OrganizationService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.user = new User(
      null,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Customer',
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
      name: [null, [Validators.required]],
      email: [null],
      registration: [null, Validators.required],
      cpf: [null, [Validators.required]],
      landline: [null],
      cellphone: [null, [Validators.required]],
      whatsapp: [null],
      simple_address: [null],
      role_id: [null, Validators.required],
      organization_id: [null, Validators.required]
    });

    this.formUtils = new FormUtils(this.form);
  }

  ngOnInit() {
    this.route.params.switchMap(
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

  create() {
    this.applyFormValues();

    this.userService.create(this.user).subscribe(
      () => this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Usuário criado com sucesso!'}),
      (error) => this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro inesperado ao tentar criar o usuário.'})
    );

    this.router.navigate(['/']);
  }

  update() {
    this.applyFormValues();

    let errorFound = false;

    if (!cpf.isValid(this.user.cpf)) {
      this.messageService.add({severity: 'error', summary: 'Erro', detail: 'CPF inválido.'});
      errorFound = true;
    }

    if (this.user.landline && this.user.landline.length !== 11) {
      this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Telefone fixo precisa ter 11 dígitos.'});
      errorFound = true;
    }

    if (this.user.landline && this.user.cellphone.length !== 11) {
      this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Celular precisa ter 11 dígitos.'});
      errorFound = true;
    }

    if (this.user.whatsapp && this.user.whatsapp.length !== 11) {
      this.messageService.add({severity: 'error', summary: 'Erro', detail: 'WhatsApp precisa ter 11 dígitos.'});
      errorFound = true;
    }

    if (errorFound) { return false; };

    this.userService.update(this.user).subscribe(
      (response) => this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado!'}),
      (errorRseponse) => this.messageService.add({severity: 'error', summary: 'Erro', detail: errorRseponse.error.errors.cellphone[0]})
    );
  }

  createOrUpdate() {
    if (this.user.id) {
      this.update();
    } else {
      this.create();
    }
  }

  public goBack() {
    this.location.back();
  }

  private setUser(user: User): void {
    this.user = user;
    this.form.patchValue(user);
  }

  private applyFormValues() {
    if (this.form.get('name').value) { this.user.name = this.form.get('name').value; }
    if (this.form.get('email').value) { this.user.email = this.form.get('email').value; }
    if (this.form.get('registration').value) { this.user.registration = this.form.get('registration').value; }
    if (this.form.get('cpf').value) { this.user.cpf = cpf.strip(this.form.get('cpf').value).match(/\d+/g).join([]); }
    if (this.form.get('landline').value) { this.user.landline = this.form.get('landline').value.match(/\d+/g).join([]); }
    if (this.form.get('cellphone').value) { this.user.cellphone = this.form.get('cellphone').value.match(/\d+/g).join([]); }
    if (this.form.get('whatsapp').value) { this.user.whatsapp = this.form.get('whatsapp').value.match(/\d+/g).join([]); }
    if (this.form.get('simple_address').value) { this.user.simple_address = this.form.get('simple_address').value; }
    if (this.form.get('role_id').value) { this.user.role_id = this.form.get('role_id').value; }
    if (this.form.get('organization_id').value) { this.user.organization_id = this.form.get('organization_id').value; }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
