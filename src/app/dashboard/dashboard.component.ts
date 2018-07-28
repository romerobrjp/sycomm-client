import { Component, OnInit } from '@angular/core';
import {Activity} from '../activities/shared/activity.model';
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
  employeeLastActivities: Array<Activity>;
  employeeDayActivities: Array<Activity>;
  activityDictionary = {
    'not_started' : 'Não iniciada',
    'in_progress' : 'Em progresso',
    'finished' : 'Finalizada',
    'closed' : 'Fechada'
  };

  activityTypesDictionary = {
    'attendance' : 'Atendimento',
    'offer' : 'Oferta',
  };

  constructor(private activityService: ActivityService,
              public authService: AuthService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.listEmployeeDayActivities();
    this.listEmployeeLastActivities();
  }

  listEmployeeLastActivities() {
    this.activityService.listYesterdayEmployeeActivities(this.authService.getCurrentUser()['id'], 5).subscribe(
      successResponse => {
        this.employeeLastActivities = successResponse;
      },
      errorResponse => {
        console.error('Ocorreu um erro ao tentar buscar as atividades deste usuário:' + errorResponse);
      }
    );
  }

  listEmployeeDayActivities() {
    this.activityService.listEmployeeDayActivities(this.authService.getCurrentUser()['id']).subscribe(
      successResponse => {
        this.employeeDayActivities = successResponse;
      },
      errorResponse => {
        console.error('Ocorreu um erro ao tentar buscar as atividades deste usuário:' + errorResponse);
      }
    );
  }

  getUserActivitiesLength(): number {
    if (this.employeeLastActivities) {
      return this.employeeLastActivities.length;
    }
  }

  getEmployeeDayActivitiesLength(): number {
    if (this.employeeDayActivities) {
      return this.employeeDayActivities.length;
    }
  }

  getClassForActivitStatus(status: string) {

  }
}
