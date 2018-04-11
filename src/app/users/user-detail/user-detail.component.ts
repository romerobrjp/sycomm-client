import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { User } from '../shared/user';
import { UserService } from '../shared/user.service';
import { Role } from '../../roles/shared/role';
import { RoleService } from '../../roles/shared/role.service';
import { Organization } from '../../organizations/shared/organization';
import { OrganizationService } from '../../organizations/shared/organization.service';

import {MessageService} from 'primeng/components/common/messageservice';
import {Message} from 'primeng/components/common/api';

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

  constructor(
    private userService: UserService, private roleService: RoleService, private organizationService: OrganizationService,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      email: [null, Validators.required],
      registration: [null, Validators.required],
      cpf: [null, Validators.required],
      landline: [null],
      cellphone: [null, Validators.required],
      whatsapp: [null],
      simple_address: [null],
      role: [null, Validators.required],
      organization: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.route.params.switchMap(
      (params: Params) => this.userService.getById(+params['id'])
    ).subscribe(
      user => this.setUser(user),
      error => console.error('Erro ao carregar o usuário: ' + error)
    );

    this.roleService.getAll().subscribe(
      roles => this.roles = roles,
      error => console.error('Erro ao carregar cargos: ' + error)
    );

    this.organizationService.getAll().subscribe(
      organizations => this.organizations = organizations,
      error => console.error('Erro ao carregar organizações: ' + error)
    );
  }

  update() {
    this.user.name = this.form.get('name').value;
    this.user.email = this.form.get('email').value;
    this.user.registration = this.form.get('registration').value;
    this.user.cpf = this.form.get('cpf').value;
    this.user.landline = this.form.get('landline').value;
    this.user.cellphone = this.form.get('cellphone').value;
    this.user.whatsapp = this.form.get('whatsapp').value;
    this.user.simple_address = this.form.get('simple_address').value;
    this.user.role = this.form.get('organization').value;
    this.user.organization = this.form.get('organization').value;

    this.userService.update(this.user).subscribe(
      () => this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado!'}),
      (error) => this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro inesperado ao atualizar o usuário.'})
    );
  }

  public goBack() {
    this.location.back();
  }

  private setUser(user: User): void {
    this.user = user;
    this.form.patchValue(user);
  }
}
