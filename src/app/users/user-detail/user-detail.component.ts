
import {switchMap} from 'rxjs/operators';
import {Component, OnInit, OnChanges } from '@angular/core';
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

@Component({
  selector: 'app-user',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})

export class UserDetailComponent implements OnInit {
  user;
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

  constructor(
    public dictionary: Dictionary,
    private userService: UserService,
    private publicOfficeService: PublicOfficeService,
    private publicAgencyService: PublicAgencyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    public authService: AuthService,
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
      public_office_id: [null, Validators.required],
      public_agency_id: [null, Validators.required],
      type: [null, Validators.required]
    });

    this.formUtils = new FormUtils(this.form);
  }

  ngOnInit() {
    this.userType = this.activatedRoute.snapshot.queryParamMap.get('userType');
    this.activatedRoute.params.pipe(switchMap(
      (params: Params) => this.userService.getById(+params['id'])
    )).subscribe(
      user => {
        if (user) {
          this.setUser(user);
        }

        this.publicOfficeService.getAll().subscribe(
          publicOffices => {
            this.publicOffices = publicOffices;

            this.publicAgencyService.getAll().subscribe(
              publicAgencies => this.publicAgencies = publicAgencies,
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
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado!'});
        // this.router.navigate(['/users'], navigationExtras);
      },
      (errorResponse) => {
        for (const [key, value] of Object.entries(errorResponse.json().errors)) {
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

  private setUser(user: User): void {
    this.user = user;
    this.form.patchValue(user);
  }

  getCurrentUserTypeName(): string {
    return this.dictionary.userTypes[this.user.type];
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
  }

  private stripPhoneNumbers(phoneNumber: string) {
    if (phoneNumber) {
      return phoneNumber.replace(/\D/g, '');
    } else {
      return '';
    }
  }

  private isAdmin(): boolean {
    return this.userType === 'Admin';
  }

  private isEmployee(): boolean {
    return this.userType === 'Employee';
  }

  private isCustomer(): boolean {
    return this.userType === 'Customer';
  }
}
