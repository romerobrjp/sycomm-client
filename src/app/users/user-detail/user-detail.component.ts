import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { Role } from '../../roles/shared/role.model';
import { RoleService } from '../../roles/shared/role.service';

@Component({
  selector: 'app-user',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})

export class UserDetailComponent implements OnInit {
  public user: User;
  public roles: Role[];
  public form: FormGroup;

  constructor(
    private userService: UserService, private roleService: RoleService,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      surname: [null],
      email: [null],
      registration: [null, Validators.required],
      cpf: [null, Validators.required],
      landline: [null],
      cellphone: [null],
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
  }

  public goBack() {
    this.location.back();
  }

  private setUser(user: User): void {
    this.user = user;
    this.form.patchValue(user);
  }
}
