import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Message} from 'primeng/components/common/api';
import {FormUtils} from '../../shared/form-utils';
import {Location} from '@angular/common';
import {ActivatedRoute, NavigationExtras, Params, Router} from '@angular/router';
import {MessageService} from 'primeng/components/common/messageservice';
import {Activity} from '../shared/activity.model';
import {ActivityService} from '../shared/activity.service';
import {AuthService} from '../../shared/auth.service';
import {Dictionary} from '../../shared/dictionary';

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.css']
})
export class ActivityDetailComponent implements OnInit {
  entity: Activity = null;
  form: FormGroup;
  formUtils: FormUtils;
  msgs: Message[] = [];

  constructor(
    public authService: AuthService,
    private activityService: ActivityService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    public dictionary: Dictionary
  ) {
    this.entity = new Activity(
      null,
      '',
      '',
      null,
      null,
      null,
      null,
      '',
      null,
      null
    );

    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      annotations: [''],
      activity_type: ['', Validators.required],
      status: ['', [Validators.required]]
    });

    this.formUtils = new FormUtils(this.form);
  }

  ngOnInit() {
    this.activatedRoute.params.switchMap(
      (params: Params) => this.activityService.getById(+params['id'])
    ).subscribe(
      responseSuccess => {
        this.setEntity(responseSuccess);
      },
      responseError => {
        console.error('Erro ao tentar carrgera atividade: ' + responseError);
      }
    );
  }

  setEntity(e: Activity) {
    this.entity = e;
    this.form.patchValue(e);
  }

  goBack() {
    this.location.back();
  }

  private create() {};

  private update(): void {
    this.messageService.clear();
    this.applyFormValues();

    this.activityService.update(this.entity).subscribe(
      (response) => {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Atividade atualizada'});
      },
      (errorRseponse) => {
        for (const [key, value] of Object.entries(errorRseponse.error.errors)) {
          for (const [errorKey, errorMessage] of Object.entries(value)) {
            this.messageService.add({
              key: 'activity_detail_messages',
              severity: 'error',
              summary: Activity.attributesDictionary[key],
              detail: errorMessage
            });
          }
        }
      }
    );
  }

  private createOrUpdate() {
    if (this.entity.id) {
      this.update();
    } else {
      this.create();
    }
  }

  private applyFormValues() {
    this.entity.name = this.form.get('name').value;
    this.entity.annotations = this.form.get('annotations').value;
    this.entity.status = +this.form.get('status').value;
    this.entity.activity_type = +this.form.get('activity_type').value;
  }
}
