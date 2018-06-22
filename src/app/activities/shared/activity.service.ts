import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Activity} from './activity';
import {User} from '../../users/shared/user.model';

@Injectable()
export class ActivityService {
  public baseUrl = 'http://api.sycomm.com:3000/activities';
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/vnd.sycomm.v1'});

  constructor(private http: HttpClient) { }

  public listUserActivities(userId): Observable<Activity[]> {
    const url = `${this.baseUrl}`;

    return this.http.get<Activity[]>(`${url}/list_user_activities?user_id=${userId}`);
  }

  public listUserActivitiesPaginated(userId: number, page_number: number, per_page: number): Observable<Activity[]> {
    const url = `${this.baseUrl}/list_user_activities_paginated?user_id=${userId}&page_number=${page_number}&per_page=${per_page}`;

    return this.http.get<Activity[]>(url);
  }

  public getById(id: number): Observable<Activity> {
    const url = `${this.baseUrl}/${id}`;

    return this.http.get<Activity>(url);
  }
}
