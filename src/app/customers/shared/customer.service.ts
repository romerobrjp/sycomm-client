import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Customer } from './customer.model';

@Injectable()
export class CustomerService {
  public baseUrl = 'http://api.sycomm.com:3000/customers';
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/vnd.sycomm.v1'});

  constructor(private http: HttpClient) { }

  public listPaginated(page_number: number, per_page: number): Observable<Customer[]> {
    const url = `${this.baseUrl}/list_paginated?page_number=${page_number}&per_page=${per_page}`;

    return this.http.get<Customer[]>(url);
  }

  public getById(id: number): Observable<Customer> {
    const url = `${this.baseUrl}/${id}`;

    return this.http.get<Customer>(url);
  }

  public create(customer: Customer): Observable<Customer> {
    const url = `${this.baseUrl}`;

    return this.http.post<Customer>(url, customer, { headers: this.headers });
  }

  public update(customer: Customer): Observable<Customer> {
    const url = `${this.baseUrl}/${customer.id}`;

    return this.http.put<Customer>(url, customer, { headers: this.headers });
  }

  public delete(id: number): Observable<{}  > {
    const url = `${this.baseUrl}/${id}`;

    return this.http.delete(url, { headers: this.headers});
  }

  // PRIVATE METHODS -----------------------------------------------------------

  private handleErrors(error: Response) {
    console.error('Erro em CustomerService: ' + error);
    return Observable.throw(error);
  }
}
