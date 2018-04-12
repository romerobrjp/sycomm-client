import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { catchError, tap } from 'rxjs/operators';

import { User } from './user';

@Injectable()
export class UserService {
  public baseUrl = 'http://api.sycomm.com:3000/users';
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/vnd.sycomm.v1'});

  constructor(private http: HttpClient) { }

  public getAllPaginated(page_number: number, per_page: number): Observable<User[]> {
    const url = `${this.baseUrl}/get_all_paginated?page_number=${page_number}&per_page=${per_page}`;

    return this.http.get<User[]>(url);
  }

  public getById(id: number): Observable<User> {
    const url = `${this.baseUrl}/${id}`;

    return this.http.get(url)
      .pipe(
        tap(_ => console.log(_)),
        catchError(this.handleErrors)
      );
  }

  public update(user: User): Observable<User> {
    const url = `${this.baseUrl}/${user.id}`;

    return this.http.put(url, user, { headers: this.headers }).pipe(
      tap(_ => console.log(`Atualizou o user ${_}`)),
      catchError(this.handleErrors)
    );
  }

  // PRIVATE METHODS -----------------------------------------------------------

  private handleErrors(error: Response) {
    console.error('Erro em UserService: ' + error);
    return Observable.throw(error);
  }
}
