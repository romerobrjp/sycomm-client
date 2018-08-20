import {throwError as observableThrowError, Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Activity} from './activity.model';
import {HttpClient} from '@angular/common/http';
import {APP_CONFIG} from '../../../app-config';

@Injectable()
export class ActivityService {
  urlResource = `${APP_CONFIG.apiBaseUrl}/activities`;

  constructor(private http: HttpClient) {}

  listAllPaginated(page_number: number, per_page: number): Observable<Object> {
    const url = `${this.urlResource}/list_all_paginated?page_number=${page_number}&per_page=${per_page}`;

    return this.http.get(url).pipe(catchError(this.handleErrors));
  }

  listUserActivitiesPaginated(employee_id: number, page_number: number, per_page: number): Observable<Object> {
    const url = `${this.urlResource}/list_user_activities_paginated?employee_id=${employee_id}&page_number=${page_number}&per_page=${per_page}`;

    return this.http.get(url).pipe(catchError(this.handleErrors));
  }

  listAllDayActivities(): Observable<Activity[]> {
    const url = `${this.urlResource}/list_day_activities`;

    return this.http.get<Activity[]>(url).pipe(
      catchError(this.handleErrors)
    );
  }

  listEmployeeDayActivities(employeeId: number): Observable<Activity[]> {
    const url = `${this.urlResource}`;

    return this.http.get<Activity[]>(`${url}/list_employee_day_activities?employee_id=${employeeId}`).pipe(
      catchError(this.handleErrors),
    );
  }

  listEmployeeYesterdayActivities(employeeId, quant): Observable<Activity[]> {
    const url = `${this.urlResource}`;

    return this.http.get<Activity[]>(`${url}/list_employee_yesterday_activities?employee_id=${employeeId}&quant=${quant}`).pipe(
      catchError(this.handleErrors),
    );
  }

  listByAgendaPaginated(agendaId: number, page_number: number, per_page: number): Observable<any> {
    const url = `${this.urlResource}`;

    return this.http.get(`${url}/list_by_agenda_paginated?agenda_id=${agendaId}&page_number=${page_number}&per_page=${per_page}`).pipe(
      catchError(this.handleErrors),
    );
  }

  getById(id: number): Observable<Activity> {
    const url = `${this.urlResource}/${id}`;

    return this.http.get<Activity>(url).pipe(
      catchError(this.handleErrors),
    );
  }

  create(entity: Activity, agendaId: number): Observable<Activity> {
    const url = `${this.urlResource}`;

    return this.http.post<Activity>(url, { activity: entity, agenda_id: agendaId }).pipe(
      catchError(this.handleErrors),
    );
  }

  update(act: Activity): Observable<Activity> {
    const url = `${this.urlResource}/${act.id}`;

    return this.http.put<Activity>(url, act).pipe(
      catchError(this.handleErrors),
    );
  }

  delete(id: number): Observable<null> {
    const url = `${this.urlResource}/${id}`;

    return this.http.delete(url).pipe(
      catchError(this.handleErrors),
      map(() => null),
    );
  }

  private handleErrors(error: Response) {
    console.error('Erro em UserService: ' + error);
    return observableThrowError(error);
  }
}
