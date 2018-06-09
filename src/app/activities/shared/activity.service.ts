import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Activity} from './activity';

@Injectable()
export class ActivityService {
  public baseUrl = 'http://api.sycomm.com:3000/activities';
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/vnd.sycomm.v1'});

  constructor(private http: HttpClient) { }

  public listUserActivities(userId): Observable<Activity[]> {
    const url = `${this.baseUrl}`;

    return this.http.get<Activity[]>(`${url}/list_user_activities?user_id=${userId}`);
  }
}
