import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location, NgIf } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { Role } from '../../roles/shared/role.model';
import { RoleService } from '../../roles/shared/role.service';
import { Organization } from '../../organizations/shared/organization.model';
import { OrganizationService } from '../../organizations/shared/organization.service';

import {MessageService} from 'primeng/components/common/messageservice';
import {Message} from 'primeng/components/common/api';

import * as cpf from '@fnando/cpf'; // import the whole library
import {isValid as isValidCpf} from '@fnando/cpf'; // import just one function

@Component({
  selector: 'app-user',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})

export class UserDetailComponent implements OnInit {
  user: User;
  roles: Role[];
  organizations: Organization[];
  form: FormGroup;
  msgs: Message[] = [];
  cpfMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  phoneMask = ['(', /\d/, /\d/, ')', ' ', /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(
    private userService: UserService, private roleService: RoleService, private organizationService: OrganizationService,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.user = new User(
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
      email: [null, Validators.required],
      registration: [null, Validators.required],
      cpf: [null, Validators.required],
      landline: [null],
      cellphone: [null, Validators.required],
      whatsapp: [null],
      simple_address: [null],
      role_id: [null, Validators.required],
      organization_id: [null, Validators.required]
    });
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

  update() {
    this.applyFormValues();

    if (!cpf.isValid(this.user.cpf)) {
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: 'CPF inválido.'})
      return false;
    }

    this.userService.update(this.user).subscribe(
      () => this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado!'}),
      (error) => this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro inesperado ao atualizar o usuário.'})
    );
  }

  create() {
    this.applyFormValues();

    this.userService.create(this.user).subscribe(
      () => this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Usuário criado com sucesso!'}),
      (error) => this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro inesperado ao tentar criar o usuário.'})
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
    this.user.name = this.form.get('name').value;
    this.user.email = this.form.get('email').value;
    this.user.registration = this.form.get('registration').value;
    this.user.cpf = cpf.strip(this.form.get('cpf').value);
    this.user.landline = this.form.get('landline').value;
    this.user.cellphone = this.form.get('cellphone').value;
    this.user.whatsapp = this.form.get('whatsapp').value;
    this.user.simple_address = this.form.get('simple_address').value;
    this.user.role_id = this.form.get('role_id').value;
    this.user.organization_id = this.form.get('organization_id').value;
  }
}
