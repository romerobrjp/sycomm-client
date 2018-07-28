import { Router } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { UserService } from '../users/shared/user.service';
import { FormUtils } from '../shared/form-utils';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as cpf_lib from '@fnando/cpf';
import {AuthService} from '../shared/auth.service';
import {User} from '../users/shared/user.model';
import {Dictionary} from '../shared/dictionary';
import {GeneralUtils} from '../shared/general-utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: User;
  form: FormGroup;
  formUtils: FormUtils;
  // masks
  cpfMask = FormUtils.cpfMask;
  landlineMask = FormUtils.landlineMask;
  phoneMask = FormUtils.phoneMask;

  constructor(
    private userService: UserService,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    public dictionary: Dictionary
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
    this.userService.getById(this.authService.getCurrentUser().id).subscribe(
      retrievedUser => {
        this.userProfile = retrievedUser;
        this.form.patchValue(this.userProfile);
      }
    );
  }

  update(): void {
    this.messageService.clear();
    this.applyFormValues();

    this.userService.update(this.userProfile).subscribe(
      () => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Perfil atualizado!'});
        this.userService.getById(this.userProfile.id).subscribe(
          retrievedUser => {
            this.userProfile = retrievedUser;
          }
        );
      },
      (errorRseponse) => {
        for (const [key, value] of Object.entries(errorRseponse.error.errors)) {
          for (const [errorKey, errorMessage] of Object.entries(value)) {
            this.messageService.add({
              key: 'user_detail_messages',
              severity: 'error',
              summary: this.dictionary.userTypes[key],
              detail: errorMessage
            });
          }
        }
      }
    );
  }

  private applyFormValues() {
    this.userProfile.name = this.form.get('name').value;
    this.userProfile.email = this.form.get('email').value;
    this.userProfile.registration = this.form.get('registration').value;
    if (this.form.get('cpf').value) {
      this.userProfile.cpf = cpf_lib.strip(this.form.get('cpf').value);
    } else {
      this.userProfile.cpf = '';
    }
    this.userProfile.landline = GeneralUtils.stripPhoneNumbers(this.form.get('landline').value);
    this.userProfile.cellphone = GeneralUtils.stripPhoneNumbers(this.form.get('cellphone').value);
    this.userProfile.whatsapp = GeneralUtils.stripPhoneNumbers(this.form.get('whatsapp').value);
    this.userProfile.simple_address = this.form.get('simple_address').value;
  }
}
