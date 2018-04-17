import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { catchError, tap } from 'rxjs/operators';

import { Employee } from './employee.model';

@Injectable()
export class EmployeeService {
  public baseUrl = 'http://api.sycomm.com:3000/employees';
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/vnd.sycomm.v1'});

  constructor(private http: HttpClient) { }

  public listPaginated(page_number: number, per_page: number): Observable<Employee[]> {
    const url = `${this.baseUrl}/list_paginated?page_number=${page_number}&per_page=${per_page}`;

    return this.http.get<Employee[]>(url);
  }

  public getById(id: number): Observable<Employee> {
    const url = `${this.baseUrl}/${id}`;

    return this.http.get<Employee>(url);
  }

  public create(employee: Employee): Observable<Employee> {
    const url = `${this.baseUrl}`;

    return this.http.post<Employee>(url, employee, { headers: this.headers });
  }

  public update(employee: Employee): Observable<Employee> {
    const url = `${this.baseUrl}/${employee.id}`;

    return this.http.put<Employee>(url, employee, { headers: this.headers });
  }

  public delete(id: number): Observable<{}  > {
    const url = `${this.baseUrl}/${id}`;

    return this.http.delete(url, { headers: this.headers});
  }

  // PRIVATE METHODS -----------------------------------------------------------

  private handleErrors(error: Response) {
    console.error('Erro em EmployeeService: ' + error);
    return Observable.throw(error);
  }
}
