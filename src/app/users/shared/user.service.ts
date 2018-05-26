import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { catchError, tap } from 'rxjs/operators';

import { User } from './user.model';

@Injectable()
export class UserService {
  public baseUrl = 'http://api.sycomm.com:3000/users';
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/vnd.sycomm.v1'});

  constructor(private http: HttpClient) { }

  public listPaginated(page_number: number, per_page: number, userType: string): Observable<User[]> {
    const url = `${this.baseUrl}/list_paginated?page_number=${page_number}&per_page=${per_page}&user_type=${userType}`;

    return this.http.get<User[]>(url);
  }

  public getById(id: number): Observable<User> {
    const url = `${this.baseUrl}/${id}`;

    return this.http.get<User>(url);
  }

  public create(user: User): Observable<User> {
    const url = `${this.baseUrl}`;

    return this.http.post<User>(url, user, { headers: this.headers });
  }

  public update(user: User): Observable<User> {
    const url = `${this.baseUrl}/${user.id}`;

    return this.http.put<User>(url, user, { headers: this.headers });
  }

  public delete(id: number): Observable<{}  > {
    const url = `${this.baseUrl}/${id}`;

    return this.http.delete(url, { headers: this.headers});
  }

  // PRIVATE METHODS -----------------------------------------------------------

  private handleErrors(error: Response) {
    console.error('Erro em UserService: ' + error);
    return Observable.throw(error);
  }
}
