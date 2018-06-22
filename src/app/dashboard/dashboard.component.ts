import { Component, OnInit } from '@angular/core';
import {Activity} from '../activities/shared/activity';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/components/common/messageservice';
import {ConfirmationService} from 'primeng/api';
import {ActivityService} from '../activities/shared/activity.service';
import {AuthService} from '../shared/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userActivities: Array<Activity>;
  activityDictionary = {
    'not_started' : 'Não iniciada',
    'in_progress' : 'Em progresso',
    'finished' : 'Finalizada',
    'closed' : 'Fechada'
  };

  constructor(private activityService: ActivityService,
              public authService: AuthService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.list();
  }

  list() {
    this.activityService.listUserActivities(this.authService.getCurrentUser().id).subscribe(
      successResponse => {
        this.userActivities = successResponse;
      },
      errorResponse => {
        console.error('Ocorreu um erro ao tentar buscar as atividades deste usuário:' + errorResponse);
      }
    );
  }

  getUserActivitiesLength(): number {
    if (this.userActivities) {
      return this.userActivities.length;
    }
  }

}
