
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Customer } from './customer.model';

@Injectable()
export class CustomerService {
  public resourceUrl = '/customers';
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/vnd.sycomm.v1'});

  constructor(private http: HttpClient) { }

  public listPaginated(page_number: number, per_page: number): Observable<Customer[]> {
    const url = `${this.resourceUrl}/list_paginated?page_number=${page_number}&per_page=${per_page}`;

    return this.http.get<Customer[]>(url);
  }

  public getById(id: number): Observable<Customer> {
    const url = `${this.resourceUrl}/${id}`;

    return this.http.get<Customer>(url);
  }

  public create(customer: Customer): Observable<Customer> {
    const url = `${this.resourceUrl}`;

    return this.http.post<Customer>(url, customer, { headers: this.headers });
  }

  public update(customer: Customer): Observable<Customer> {
    const url = `${this.resourceUrl}/${customer.id}`;

    return this.http.put<Customer>(url, customer, { headers: this.headers });
  }

  public delete(id: number): Observable<{}  > {
    const url = `${this.resourceUrl}/${id}`;

    return this.http.delete(url, { headers: this.headers});
  }

  // PRIVATE METHODS -----------------------------------------------------------

  private handleErrors(error: Response) {
    console.error('Erro em CustomerService: ' + error);
    return observableThrowError(error);
  }
}
