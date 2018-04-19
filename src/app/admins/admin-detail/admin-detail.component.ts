import {Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { Admin } from '../shared/admin.model';
import { AdminService } from '../shared/admin.service';

import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/api';

import { FormUtils} from '../../shared/form-utils';

@Component({
  selector: 'app-admin',
  templateUrl: './admin-detail.component.html',
  styleUrls: ['./admin-detail.component.css']
})

export class AdminDetailComponent implements OnInit, OnChanges {
  admin: Admin;
  form: FormGroup;
  formUtils: FormUtils;
  msgs: Message[] = [];
  phoneMask = ['(', /\d/, /\d/, ')', ' ', /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.admin = new Admin(
      null,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Admin',
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
      email: [null, [Validators.required]],
      landline: [null],
      cellphone: [null],
      whatsapp: [null],
      simple_address: [null]
    });

    this.formUtils = new FormUtils(this.form);
  }

  ngOnInit() {
    this.route.params.switchMap(
      (params: Params) => this.adminService.getById(+params['id'])
    ).subscribe(
      admin => {
        if (admin) {
          this.setAdmin(admin);
        }
      },
      error => console.error('Erro ao carregar admin: ' + error)
    );
  }

  create() {
    this.applyFormValues();

    this.adminService.create(this.admin).subscribe(
      () => this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Administrador criado com sucesso!'}),
      (error) => this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro inesperado ao tentar criar o administrador.'})
    );

    this.router.navigate(['/admins']);
  }

  update() {
    this.applyFormValues();

    this.adminService.update(this.admin).subscribe(
      (response) => this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Administrador atualizado!'}),
      (errorRseponse) => this.messageService.add({severity: 'error', summary: 'Erro', detail: errorRseponse.error.errors.cellphone[0]})
    );
  }

  createOrUpdate() {
    if (this.admin.id) {
      this.update();
    } else {
      this.create();
    }

    this.router.navigate(['/admins']);
  }

  public goBack() {
    this.location.back();
  }

  private setAdmin(admin: Admin): void {
    this.admin = admin;
    this.form.patchValue(admin);
  }

  private applyFormValues() {
    if (this.form.get('name').value) { this.admin.name = this.form.get('name').value; }
    if (this.form.get('email').value) { this.admin.email = this.form.get('email').value; }
    if (this.form.get('cellphone').value) { this.admin.cellphone = this.form.get('cellphone').value.match(/\d+/g).join([]); }
    if (this.form.get('whatsapp').value) { this.admin.whatsapp = this.form.get('whatsapp').value.match(/\d+/g).join([]); }
    if (this.form.get('simple_address').value) { this.admin.simple_address = this.form.get('simple_address').value; }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
