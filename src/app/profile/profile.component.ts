import { Router } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { UserService } from './../users/shared/user.service';
import { FormUtils } from './../shared/form-utils';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as cpf_lib from '@fnando/cpf';
import {AuthService} from '../shared/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser;
  form: FormGroup;
  formUtils: FormUtils;
  userTypesDictionary = {
    'Admin' : 'Admin',
    'Employee' : 'Funcionário',
    'Customer' : 'Cliente'
  };
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
    'public_agency' : 'Organização',
    'public_office' : 'Cargo'
  };
  // masks
  registrationMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  cpfMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  phoneMask = ['(', /\d/, /\d/, ')', ' ', /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(
    private userService: UserService,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: [''],
      registration: ['', Validators.required],
      cpf: ['', [Validators.required]],
      landline: [''],
      cellphone: ['', [Validators.required]],
      whatsapp: [''],
      simple_address: ['']
    });

    this.formUtils = new FormUtils(this.form);
  }

  ngOnInit() {
    this.userService.getById(this.authService.getCurrentUser()['id']).subscribe(
      user => {
        this.currentUser = user;
        this.form.patchValue(this.currentUser);
      }
    );
  }

  update(): void {
    this.messageService.clear();
    this.applyFormValues();

    this.userService.update(this.currentUser).subscribe(
      (response) => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Perfil atualizado!'});
        this.currentUser = this.userService.getById(this.currentUser.id).subscribe(
          user => this.currentUser = user
        );
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

  private applyFormValues() {
    this.currentUser.name = this.form.get('name').value;
    this.currentUser.email = this.form.get('email').value;
    this.currentUser.registration = this.form.get('registration').value;
    if (this.form.get('cpf').value) {
      this.currentUser.cpf = cpf_lib.strip(this.form.get('cpf').value);
    } else {
      this.currentUser.cpf = '';
    }
    this.currentUser.landline = this.stripPhoneNumbers(this.form.get('landline').value);
    this.currentUser.cellphone = this.stripPhoneNumbers(this.form.get('cellphone').value);
    this.currentUser.whatsapp = this.stripPhoneNumbers(this.form.get('whatsapp').value);
    this.currentUser.simple_address = this.form.get('simple_address').value;
  }

  private stripPhoneNumbers(phoneNumber: string) {
    if (phoneNumber) {
      return phoneNumber.replace(/\D/g, '');
    } else {
      return '';
    }
  }
}
