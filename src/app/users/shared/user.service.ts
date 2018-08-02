
import {throwError as observableThrowError, Observable, from} from 'rxjs';

import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { User } from './user.model';
import { TokenService } from '../../shared/token.service';
import {Response} from '@angular/http';

@Injectable()
export class UserService {
  urlResource: string = 'users';

  constructor(private http: TokenService) {}

  listPaginated(page_number: number,
                per_page: number,
                userType: string,
                sortField: string,
                sortDirection: string,
                searchField: string,
                searchText: string): Observable<Response> {
    const url = `${this.urlResource}/list_paginated?page_number=${page_number}&per_page=${per_page}&user_type=${userType}&sortField=${sortField}&sortDirection=${sortDirection}&searchField=${searchField}&searchText=${searchText}`;

    return this.http.get(url).pipe(
      map((response: Response) => response),
      catchError(this.handleErrors)
    );
  }

  listBytype(userType: string): Observable<User[]> {
    const url = `${this.urlResource}/list_by_type?user_type=${userType}`;

    return this.http.get(url).pipe(
      map((response: Response) => this.responseToModels(response)),
      catchError(this.handleErrors)
    );
  }

  getById(id: number): Observable<User> {
    const url = `${this.urlResource}/${id}`;

    return this.http.get(url).pipe(
      map((response: Response) => this.responseToModel(response)),
      catchError(this.handleErrors),
    );
  }

  getByCpf(cpf: string): Observable<User> {
    const url = `${this.urlResource}/get_customer_by_cpf/${cpf}`;

    return this.http.get(url).pipe(
      map((response: Response) => this.responseToModel(response)),
      catchError(this.handleErrors),
    );
  }

  create(user: User): Observable<User> {
    const url = `${this.urlResource}`;

    return this.http.post(url, user).pipe(
      map((response: Response) => this.responseToModel(response)),
      catchError(this.handleErrors),
    );
  }

  update(user: User): Observable<User> {
    const url = `${this.urlResource}/${user.id}`;

    return this.http.put(url, user).pipe(
      catchError(this.handleErrors),
      map((response: Response) => this.responseToModel(response)),
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

    return this.http.get(url).pipe(
      map((response: Response) => this.responseToModels(response)),
      catchError(this.handleErrors)
    );
  }

  // PRIVATE METHODS -----------------------------------------------------------

  private handleErrors(error: Response) {
    console.error('Erro em UserService: ' + error);
    return observableThrowError(error);
  }

  private responseToModel(response: Response): User {
    const userJson = response.json();

    return new User(
      userJson['id'],
      userJson['name'],
      userJson['type'],
      userJson['created_at'],
      userJson['updated_at'],
      userJson['auth_token'],
      userJson['email'],
      userJson['cpf'],
      userJson['landline'],
      userJson['cellphone'],
      userJson['whatsapp'],
      userJson['simple_address'],
      userJson['registration'],
      userJson['password'],
      userJson['password_confirmation'],
      userJson['public_agency_id'],
      userJson['public_office_id'],
      userJson['address_id'],
      userJson['encrypted_password'],
      userJson['reset_password_token'],
      userJson['reset_password_sent_at'],
      userJson['sign_in_count'],
      userJson['current_sign_in_at'],
      userJson['last_sign_in_at'],
      userJson['current_sign_in_ip'],
      userJson['last_sign_in_ip'],
      userJson['agendas'],
      userJson['activities'],
    );
  }

  private responseToModels(response: Response): User[] {
    // let collection =  response.json()['data'] as Array<any>;
    let collection =  response.json();
    let users: User[] = [];

    collection.forEach(jsonEntity => {
      let user = new User(
        jsonEntity['id'],
        jsonEntity['name'],
        jsonEntity['type'],
        jsonEntity['created_at'],
        jsonEntity['updated_at'],
        jsonEntity['auth_token'],
        jsonEntity['email'],
        jsonEntity['cpf'],
        jsonEntity['landline'],
        jsonEntity['cellphone'],
        jsonEntity['whatsapp'],
        jsonEntity['simple_address'],
        jsonEntity['registration'],
        jsonEntity['password'],
        jsonEntity['password_confirmation'],
        jsonEntity['public_agency_id'],
        jsonEntity['public_office_id'],
        jsonEntity['address_id'],
        jsonEntity['encrypted_password'],
        jsonEntity['reset_password_token'],
        jsonEntity['reset_password_sent_at'],
        jsonEntity['sign_in_count'],
        jsonEntity['current_sign_in_at'],
        jsonEntity['last_sign_in_at'],
        jsonEntity['current_sign_in_ip'],
        jsonEntity['last_sign_in_ip'],
        jsonEntity['agendas'],
        jsonEntity['activities'],
      );

      users.push(user);
    });

    return users;
  }
}
