
import {throwError as observableThrowError, Observable} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Activity} from './activity.model';
import {TokenService} from '../../shared/token.service';
import {Response} from '@angular/http';

@Injectable()
export class ActivityService {
  urlResource = 'activities';

  constructor(private http: TokenService) { }

  listYesterdayEmployeeActivities(employeeId, quant): Observable<Activity[]> {
    const url = `${this.urlResource}`;

    return this.http.get(`${url}/list_employee_yesterday_activities?employee_id=${employeeId}&quant=${quant}`).pipe(
      catchError(this.handleErrors),
      map((response: Response) => this.responseToModels(response)),
    );
  }

  listAllPaginated(page_number: number, per_page: number): Observable<Response> {
    const url = `${this.urlResource}/list_all_paginated?page_number=${page_number}&per_page=${per_page}`;

    return this.http.get(url).pipe(catchError(this.handleErrors));
  }

  listUserActivitiesPaginated(employee_id: number, page_number: number, per_page: number): Observable<Response> {
    const url = `${this.urlResource}/list_user_activities_paginated?employee_id=${employee_id}&page_number=${page_number}&per_page=${per_page}`;

    return this.http.get(url).pipe(catchError(this.handleErrors));
  }

  listEmployeeDayActivities(employeeId: number) {
    const url = `${this.urlResource}`;

    return this.http.get(`${url}/list_employee_day_activities?employee_id=${employeeId}`).pipe(
      catchError(this.handleErrors),
      map((response: Response) => this.responseToModels(response)),
    );
  }

  getById(id: number): Observable<Activity> {
    const url = `${this.urlResource}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleErrors),
      map((response: Response) => this.responseToModel(response))
    );
  }

  create(entity: Activity): Observable<Activity> {
    const url = `${this.urlResource}`;

    return this.http.post(url, entity).pipe(
      map((response: Response) => this.responseToModel(response)),
      catchError(this.handleErrors),
    );
  }

  update(act: Activity): Observable<Activity> {
    const url = `${this.urlResource}/${act.id}`;

    return this.http.put(url, act).pipe(
      catchError(this.handleErrors),
      map((response: Response) => this.responseToModel(response))
    );
  }

  private responseToModel(response: Response): Activity {
    const jsonEntity = response.json();

    return new Activity(
      jsonEntity['id'],
      jsonEntity['name'],
      jsonEntity['description'],
      jsonEntity['annotations'],
      jsonEntity['status'],
      jsonEntity['activity_type'],
      jsonEntity['employee_id'],
      jsonEntity['customer_id'],
      jsonEntity['customer_name'],
      jsonEntity['created_at'],
      jsonEntity['updated_at'],
      jsonEntity['agenda'],
      jsonEntity['employee'],
    );
  }

  private responseToModels(response: Response): Array<Activity> {
    const collection = response.json()['data'] as Array<any>;
    const items: Activity[] = [];

    collection.forEach(jsonEntity => {
      const item = new Activity(
        jsonEntity['id'],
        jsonEntity['name'],
        jsonEntity['description'],
        jsonEntity['annotations'],
        jsonEntity['status'],
        jsonEntity['activity_type'],
        jsonEntity['employee_id'],
        jsonEntity['customer_id'],
        jsonEntity['customer_name'],
        jsonEntity['created_at'],
        jsonEntity['updated_at'],
        jsonEntity['agenda'],
        jsonEntity['employee'],
      );

      items.push(item);
    });

    return items;
  }

  private handleErrors(error: Response) {
    console.error('Erro em UserService: ' + error);
    return observableThrowError(error);
  }
}
