
import {throwError as observableThrowError, Observable} from 'rxjs';

import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { User } from './user.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {APP_CONFIG} from '../../../app-config';

@Injectable()
export class UserService {
  urlResource = `${APP_CONFIG.apiBaseUrl}/users`;

  constructor(private http: HttpClient) {}

  listPaginated(page_number: number,
                per_page: number,
                userType: string,
                sortField: string,
                sortDirection: string,
                searchField: string,
                searchText: string): Observable<Object> {
    const url = `${this.urlResource}/list_paginated?page_number=${page_number}&per_page=${per_page}&user_type=${userType}&sortField=${sortField}&sortDirection=${sortDirection}&searchField=${searchField}&searchText=${searchText}`;

    return this.http.get<Object>(url).pipe(
      catchError(this.handleErrors)
    );
  }

  listBytype(userType: string): Observable<User[]> {
    const url = `${this.urlResource}/list_by_type?user_type=${userType}`;

    return this.http.get<User[]>(url).pipe(
      catchError(this.handleErrors)
    );
  }

  listCustomersByAgenda(agendaId: number): Observable<User[]> {
    const url = `${this.urlResource}/list_customers_by_agenda?agenda_id=${agendaId}`;

    return this.http.get<User[]>(url).pipe(
      catchError(this.handleErrors)
    );
  }

  getById(id: number): Observable<User> {
    const url = `${this.urlResource}/${id}`;

    return this.http.get<User>(url).pipe(
      catchError(this.handleErrors),
    );
  }

  getByCpf(cpf: string): Observable<User> {
    const url = `${this.urlResource}/get_customer_by_cpf/${cpf}`;

    return this.http.get<User>(url).pipe(
      catchError(this.handleErrors),
    );
  }

  create(user: User): Observable<User> {
    const url = `${this.urlResource}`;

    return this.http.post<User>(url, user).pipe(
      catchError(this.handleErrors),
    );
  }

  update(user: User): Observable<User> {
    const url = `${this.urlResource}/${user.id}`;

    return this.http.put<User>(url, user).pipe(
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

  listEmployeesWithDayActivities(): Observable<User[]> {
    const url = `${this.urlResource}/list_employees_with_day_activities`;

    return this.http.get<User[]>(url).pipe(
      catchError(this.handleErrors)
    );
  }

  syncConfirmeOnline(cpf): Observable<Object[]> {
    const url = `${this.urlResource}/sync_confirme_online`;

    const httpParams: HttpParams = new HttpParams().set('cpf', cpf);

    return this.http.get<Object[]>(url, { params: httpParams }).pipe(
      catchError(this.handleErrors)
    );
  }

  // PRIVATE METHODS -----------------------------------------------------------

  private handleErrors(error: Response) {
    console.log('Erro em UserService: ');
    console.error(error);
    return observableThrowError(error);
  }
}
