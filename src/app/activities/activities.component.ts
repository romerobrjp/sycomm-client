import { Component, OnInit } from '@angular/core';
import {UserService} from '../users/shared/user.service';
import {ConfirmationService} from 'primeng/api';
import {MessageService} from 'primeng/components/common/messageservice';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivityService} from './shared/activity.service';
import {Activity} from './shared/activity';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  userActivities: Array<Activity>;
  activityDictionary = {
    'not_started' : 'Não iniciada',
    'in_progress' : 'Em progresso',
    'finished' : 'Finalizada',
    'closed' : 'Fechada'
  };

  constructor(private activityService: ActivityService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.list();
  }

  list() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.activityService.listUserActivities(currentUser['id']).subscribe(
      successResponse => {
        this.userActivities = successResponse;
        console.log(this.userActivities);
      },
      errorResponse => {
        console.error('Ocorreu um erro ao tentar buscar as atividades deste usuário:' + errorResponse);
      }
    );
  }
}
