import { Component, OnInit } from '@angular/core';
import {Activity} from '../activities/shared/activity.model';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/components/common/messageservice';
import {ConfirmationService} from 'primeng/api';
import {ActivityService} from '../activities/shared/activity.service';
import {AuthService} from '../shared/auth.service';
import {UserService} from '../users/shared/user.service';
import {User} from '../users/shared/user.model';
import {Dictionary} from '../shared/dictionary';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  employeeLastActivities: Array<Activity> = [];
  employeeDayActivities: Array<Activity> = [];
  dayActivities: Array<Activity> = [];
  employeesWithDayActivities: Array<User> = [];
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

  constructor(public authService: AuthService,
              private activityService: ActivityService,
              private userService: UserService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              public dictionary: Dictionary
  ) { }

  ngOnInit() {
    if (this.authService.isAdmin()) {
      this.listEmployeesWithDayActivities();
    }
    if (this.authService.isEmployee()) {
      this.listEmployeeDayActivities();
      this.listEmployeeLastActivities();
    }
  }

  listDayActivities() {
    this.activityService.listAllDayActivities().subscribe(
      successResponse => {
        this.dayActivities = successResponse;
      },
      errorResponse => {
        console.error('Ocorreu um erro ao tentar buscar as atividades do dia:' + errorResponse);
      }
    );
  }

  listEmployeesWithDayActivities() {
    this.userService.listEmployeesWithDayActivities().subscribe(
      successResponse => {
        this.employeesWithDayActivities = successResponse;
      },
      errorResponse => {
        console.error('Ocorreu um erro ao tentar buscar os funcionario com atividades hoje:' + errorResponse);
      }
    );
  }

  listEmployeeLastActivities() {
    this.activityService.listEmployeeYesterdayActivities(this.authService.getCurrentUser()['id'], 5).subscribe(
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

  getTitle(): string {
    if (this.authService.isAdmin()) return "Atividades do dia"
    if (this.authService.isEmployee()) return "Dashboard"
  }
}
