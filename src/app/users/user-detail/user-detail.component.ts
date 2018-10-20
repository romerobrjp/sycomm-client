import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { AuthService } from '../../shared/auth.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { PublicAgencyService } from '../../public-agencies/shared/public-agency.service';
import { PublicOfficeService } from '../../public-offices/shared/public-office.service';
import { UserService } from '../shared/user.service';

import { User } from '../shared/user.model';
import { PublicOffice } from '../../public-offices/shared/public-office.model';
import { PublicAgency } from '../../public-agencies/shared/public-agency.model';

import { Message } from 'primeng/components/common/api';
import { Dictionary } from '../../shared/dictionary';
import { FormUtils} from '../../shared/form-utils';
import * as cpf_lib from '@fnando/cpf';
import swal from 'sweetalert2';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-user',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})

export class UserDetailComponent implements OnInit {
  user: User;
  publicOffices: PublicOffice[];
  publicAgencies: PublicAgency[];
  form: FormGroup;
  formUtils: FormUtils;
  msgs: Message[] = [];
  userType: string;
  // masks
  registrationMask = FormUtils.registrationMask;
  cpfMask = FormUtils.cpfMask;
  phoneMask = FormUtils.phoneMask;

  displayConfirmeOnlineDialog = false;
  candidates: Object[] = [];

  constructor(
    public dictionary: Dictionary,
    public authService: AuthService,
    private userService: UserService,
    private publicOfficeService: PublicOfficeService,
    private publicAgencyService: PublicAgencyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
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

    this.userType = this.activatedRoute.snapshot.queryParamMap.get('userType');

    switch (this.userType) {
      case 'Admin': {
        this.form = this.formBuilder.group({
          name: ['', [Validators.required]],
          email: [''],
          landline: [''],
          cellphone: [''],
          whatsapp: [''],
          type: [null, Validators.required]
        });
      }
      case 'Employee': {
        this.form = this.formBuilder.group({
          name: ['', [Validators.required]],
          email: [''],
          cpf: ['', [Validators.required]],
          landline: [''],
          cellphone: ['', [Validators.required]],
          whatsapp: [''],
          simple_address: [''],
          type: [null, Validators.required]
        });
      }
      case 'Customer': {
        this.form = this.formBuilder.group({
          name: ['', [Validators.required]],
          email: [''],
          registration: ['', Validators.required],
          cpf: ['', [Validators.required]],
          landline: [''],
          cellphone: ['', [Validators.required]],
          whatsapp: [''],
          simple_address: [''],
          public_office_id: [null, Validators.required],
          public_agency_id: [null, Validators.required],
          type: [null, Validators.required]
        });
      }
    }

    this.formUtils = new FormUtils(this.form);
  }

  ngOnInit() {
    this.userType = this.activatedRoute.snapshot.queryParamMap.get('userType');
    this.form.controls['type'].setValue(this.userType);

    this.activatedRoute.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          this.userService.getById(+params['id']).subscribe(
            user => {
              if (user) {
                this.setUser(user);
              }
            },
            error => console.error('Erro ao carregar o usuário: ' + error)
          );
        }
      }
    );

    this.publicOfficeService.getAll().subscribe(
      responseSuccess => this.publicOffices = responseSuccess['data'],
      error => console.error('Erro ao carregar Cargos: ' + error)
    );

    this.publicAgencyService.getAll().subscribe(
      responseSuccess => this.publicAgencies = responseSuccess['data'],
      error => console.error('Erro ao carregar Orgaos: ' + error)
    );
  }

  create(): boolean {
    // if (this.form.invalid) {
    //   Object.keys(this.form.controls).forEach(key => {
    //     // this.form.get(key).markAsDirty();
    //     console.log(key);
    //     this.form.get
    //     this.formUtils.showFieldError(key);
    //   });
    //
    //   return false;
    // }

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

  update(confirmeOnline: boolean = false): void {
    this.messageService.clear();

    if (!confirmeOnline) this.applyFormValues();

    // const navigationExtras: NavigationExtras = {
    //   queryParams: { 'userType': this.user.type }
    // };

    this.userService.update(this.user).subscribe(
      (response) => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado!'});
        // this.router.navigate(['/users'], navigationExtras);
      },
      (errorResponse) => {
        for (const [key, value] of Object.entries(errorResponse['error']['errors'])) {
          for (const [errorKey, errorMessage] of Object.entries(value)) {
            this.messageService.add({
              key: 'user_detail_messages',
              severity: 'error',
              summary: User.attributesDictionary[key],
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

  generateBootstrapColsClasses() {
    if (this.authService.isAdmin()) {
      return { 'col-lg-3 col-lg-offset-4' : true };
    } else if (this.authService.isEmployee()) {
      return { 'col-lg-3 col-lg-offset-4' : true };
    } else if (this.authService.isAdmin()) {
      return { 'col-lg-2 col-lg-offset-3' : true };
    }
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

  getCurrentUserTypeName(): string {
    return this.dictionary.userTypes[this.user.type];
  }

  private setUser(user: User): void {
    this.user = user;
    this.form.patchValue(user);
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
    this.user.public_office_id = this.form.get('public_office_id').value;
    this.user.public_agency_id = this.form.get('public_agency_id').value;
    this.user.type = this.form.get('type').value;
  }

  // CONFIRME ONLINE { ---------------------------------------------------------------------------------------------------------------------

  syncConfirmeOnline(event) {
    event.preventDefault();

    this.userService.syncConfirmeOnline(1, 'INTBRASCREDI', 'ULOD8E', 'PSHAH', this.user.cpf).subscribe(
      (responseSuccess) => {
        console.log(responseSuccess);
        let confirmeOnlineRetrievedData: Object[] = [];

        if (responseSuccess['RESULTADO'] && responseSuccess['RESULTADO']['MSG'] === 'Registro Nao Localizado') {
          swal('Aviso', 'Desculpe, este cliente não se encontra na base de dados do Confirme Online.', 'warning');
        }
        else {
          if (responseSuccess['RESULTADO']['REGISTRO'] instanceof Array) {
            confirmeOnlineRetrievedData = responseSuccess['RESULTADO']['REGISTRO'];
          } else {
            confirmeOnlineRetrievedData.push(responseSuccess['RESULTADO']['REGISTRO']);
          }

          this.candidates = confirmeOnlineRetrievedData.map(
            (snapshot) => {
              return {
                'Nome' : snapshot['NOME'] === 'NULL' ? null : snapshot['NOME'],
                'CPF' : snapshot['CPFCNPJ'] === 'NULL' ? null : snapshot['CPFCNPJ'],
                'Celular' : snapshot['TELEFONE'] === 'NULL' ? null : snapshot['TELEFONE'],
                'Whatsapp' : this.generateWhatsapp(snapshot['TELEFONE'], snapshot['whatsapp']),
                'Endereço' : this.generateSimpleAdressFromConfirmeOnline(snapshot['ENDERECO'], snapshot['NUMERO'], snapshot['COMPLEMENTO'], snapshot['BAIRRO'], snapshot['CEP'], snapshot['CIDADE'], snapshot['UF']),
              };
            }
          );

          this.candidates.forEach(u => console.log(u));

          this.displayConfirmeOnlineDialog = true;
        }
      },
      (responseError) => {
        console.log(responseError);
      }
    );
  }

  selectUserFromConfirmeOnline(candidate: Object): void {
    this.confirmationService.confirm(
      {
        header: 'Confirmação',
        message: `Tem certeza que deseja atualizar o cliente '${candidate['Nome']}' com os dados escolhidos?`,
        icon: 'fa fa-question-circle',
        accept: () => {
          this.user.name = candidate['Nome'];
          this.user.cpf = candidate['CPF'];
          this.user.cellphone = candidate['Celular'] === 'NULL' ? null : candidate['Celular'];
          this.user.whatsapp = candidate['Whatsapp'] === 'NULL' ? null : candidate['Whatsapp'];
          this.user.simple_address = candidate['Endereço'] === 'NULL' ? null : candidate['Endereço'];

          this.update(true);

          this.displayConfirmeOnlineDialog = false;
          this.ngOnInit();
        },
        reject: () => {
          return false;
        }
      }
    );
  }

  private generateSimpleAdressFromConfirmeOnline(logradouro: string,
                                                 numero: string,
                                                 complemento: string,
                                                 bairro: string,
                                                 cep: string,
                                                 cidade: string,
                                                 uf: string): string {
    logradouro = logradouro === 'NULL' ? '' : `${logradouro},`;
    numero = numero === 'NULL' ? '' : `${numero},`;
    complemento = complemento === 'NULL' ? '' : `${complemento},`;
    bairro = bairro === 'NULL' ? '' : `${bairro},`;
    cep = cep === 'NULL' ? '' : `${cep},`;
    cidade = cidade === 'NULL' ? '' : `${cidade},`;
    uf = uf === 'NULL' ? '' : `${uf}`;

    return `${logradouro} ${numero} ${complemento} ${bairro} ${cep} ${cidade} ${uf}`;
  }

  private generateWhatsapp(landline: string, isWhatsapp: boolean): string {
    if (isWhatsapp) {
      return landline;
    }
  }

  // CONFIRME ONLINE } ---------------------------------------------------------------------------------------------------------------------

  private stripPhoneNumbers(phoneNumber: string) {
    if (phoneNumber) {
      return phoneNumber.replace(/\D/g, '');
    } else {
      return '';
    }
  }
}
