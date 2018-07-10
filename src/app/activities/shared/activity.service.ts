
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

  listLastUserActivities(userId, quant): Observable<Activity[]> {
    const url = `${this.urlResource}`;

    return this.http.get(`${url}/list_last_user_activities?user_id=${userId}&quant=${quant}`).pipe(
      catchError(this.handleErrors),
      map((response: Response) => this.responseToModels(response)),
    );
  }

  listAllPaginated(page_number: number, per_page: number): Observable<Response> {
    const url = `${this.urlResource}/list_all_paginated?page_number=${page_number}&per_page=${per_page}`;

    return this.http.get(url).pipe(catchError(this.handleErrors));
  }

  listUserActivitiesPaginated(userId: number, page_number: number, per_page: number): Observable<Response> {
    const url = `${this.urlResource}/list_user_activities_paginated?user_id=${userId}&page_number=${page_number}&per_page=${per_page}`;

    return this.http.get(url).pipe(catchError(this.handleErrors));
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
      jsonEntity['user_id'],
      jsonEntity['client_id'],
      jsonEntity['client_name'],
      jsonEntity['created_at'],
      jsonEntity['updated_at'],
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
        jsonEntity['user_id'],
        jsonEntity['client_id'],
        jsonEntity['client_name'],
        jsonEntity['created_at'],
        jsonEntity['updated_at'],
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
