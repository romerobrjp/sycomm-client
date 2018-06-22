import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Message} from 'primeng/components/common/api';
import {FormUtils} from '../../shared/form-utils';
import {Location} from '@angular/common';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MessageService} from 'primeng/components/common/messageservice';
import {Activity} from '../shared/activity';
import {ActivityService} from '../shared/activity.service';

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
  actTypes: Array<Object> = [
    { id: '0', name: 'Atendimento'},
    { id: '1', name: 'Proposta' },
  ];
  actStatuses: Array<Object> = [
    { id: '0', name: 'Não iniciado'},
    { id: '1', name: 'Em andamento' },
    { id: '2', name: 'Finalizado' },
    { id: '3', name: 'Fechado' },
  ];
  currentUser;

  constructor(
    private activityService: ActivityService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private messageService: MessageService
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
        this.setActivity(responseSuccess);
      },
      responseError => {
        console.error('Erro ao tentar carrgera atividade: ' + responseError);
      }
    );
  }

  setActivity(act: Activity) {
    this.entity = act;
    this.form.patchValue(act);
  }

  goBack() {
    this.location.back();
  }
}
