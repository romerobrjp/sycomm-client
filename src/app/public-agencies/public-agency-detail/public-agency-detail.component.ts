import { Component, OnInit } from '@angular/core';
import {PublicAgency} from '../shared/public-agency.model';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MessageService} from 'primeng/components/common/messageservice';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Dictionary} from '../../shared/dictionary';
import {Location} from '@angular/common';
import {Message} from 'primeng/components/common/api';
import {AuthService} from '../../shared/auth.service';
import {FormUtils} from '../../shared/form-utils';
import {PublicAgencyService} from '../shared/public-agency.service';

@Component({
  selector: 'app-public-agency-detail',
  templateUrl: './public-agency-detail.component.html',
  styleUrls: ['./public-agency-detail.component.scss']
})
export class PublicAgencyDetailComponent implements OnInit {
  model;
  form: FormGroup;
  formUtils: FormUtils;
  msgs: Message[] = [];

  constructor(
    public dictionary: Dictionary,
    private publicAgencyService: PublicAgencyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    public authService: AuthService,
  ) {
    this.model = new PublicAgency(
      null,
      '',
      '',
    );

    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.formUtils = new FormUtils(this.form);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          this.publicAgencyService.getById(+params['id']).subscribe(
            publicAgency => this.setPublicAgency(publicAgency),
            error => console.error('Erro ao carregar o Órgão: ' + error)
          );
        }
      }
    );
  }

  create(): boolean {
    this.applyFormValues();
    this.publicAgencyService.create(this.model).subscribe(
      () => {
        this.router.navigate(['/public-agencies']);
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Órgão criado com sucesso!'});
      },
      () => {
        this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro inesperado ao tentar criar este Órgão.'});
        return false;
      }
    );

    return true;
  }

  update(): void {
    this.messageService.clear();
    this.applyFormValues();
    this.publicAgencyService.update(this.model).subscribe(
      () => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Órgão atualizado!'});
      },
      (errorResponse) => {
        for (const [key, value] of Object.entries(errorResponse.errors)) {
          for (const [errorKey, errorMessage] of Object.entries(value)) {
            this.messageService.add({
              key: 'publicAgency_detail_messages',
              severity: 'error',
              summary: PublicAgency.attributesDictionary[key],
              detail: errorMessage
            });
          }
        }
      }
    );
  }

  createOrUpdate() {
    if (this.model.id) {
      this.update();
    } else {
      this.create();
    }
  }

  goBack() {
    this.location.back();
  }

  private setPublicAgency(model: PublicAgency): void {
    this.model = model;
    this.form.patchValue(model);
  }

  private applyFormValues() {
    this.model.name = this.form.get('name').value;
    this.model.description = this.form.get('description').value;
  }

}
