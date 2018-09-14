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
import swal from 'sweetalert2';
import {AngularTokenService} from 'angular-token';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: User;
  form: FormGroup;
  changePasswordForm: FormGroup;
  formUtils: FormUtils;
  // masks
  cpfMask = FormUtils.cpfMask;
  landlineMask = FormUtils.landlineMask;
  phoneMask = FormUtils.phoneMask;

  constructor(
    public authService: AuthService,
    public dictionary: Dictionary,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private tokenService: AngularTokenService,
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

    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      newPasswordConfirmation: ['', [Validators.required]],
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
              key: 'profile_messages',
              severity: 'error',
              summary: this.dictionary.userTypes[key],
              detail: errorMessage
            });
          }
        }
      }
    );
  }

  changePassword() {
    this.messageService.clear();

    const oldPassword = this.changePasswordForm.get('oldPassword').value;
    const newPassword = this.changePasswordForm.get('newPassword').value;
    const newPasswordConfirmation = this.changePasswordForm.get('newPasswordConfirmation').value;

    if (!oldPassword) {
      swal('Atenção', 'Por favor, informe a senha antiga.', 'warning');
      return false;
    }
    if (!newPassword) {
      swal('Atenção', 'Por favor, informe a nova senha.', 'warning');
      return false;
    }
    if (!newPasswordConfirmation) {
      swal('Atenção', 'Por favor, confirme a nova senha.', 'warning');
      return false;
    }

    if (oldPassword === newPassword) {
      swal('Atenção', 'A nova senha deve ser diferente a senha antiga!', 'error');
      return false;
    }

    if (newPassword !== newPasswordConfirmation) {
      swal('Atenção', 'A confirmação de senha não confere com a nova senha informada!', 'error');
      return false;
    }

    this.tokenService.updatePassword({
      password:             newPassword,
      passwordConfirmation: newPasswordConfirmation,
      passwordCurrent:      oldPassword,
    }).subscribe(
      responseSuccess => {
        this.changePasswordForm.get('oldPassword').reset('');
        this.changePasswordForm.get('newPassword').reset('');
        this.changePasswordForm.get('newPasswordConfirmation').reset('');

        console.log(responseSuccess);
        swal('Sucesso', 'Senha atualizada!', 'success');
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Senha atualizada!'});
      },
      responseError => {
        switch (responseError['status']) {
          case 422: {
            if (responseError.error.errors.full_messages[0] === 'Current password não é válido') {
              swal('Erro', 'Senha atual incorreta. Tente novamente.', 'error');
            }
            break;
          }
          default: {
            swal('Erro', 'Estamos problemas para efetuar a atualização da sua senha. Por favor, tente novamente mais tarde.', 'error');
            this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Estamos problemas para efetuar a atualização da sua senha. Por favor, tente novamente mais tarde.'});
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
