import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Admin } from './admin.model';

@Injectable()
export class AdminService {
  public baseUrl = 'http://api.sycomm.com:3000/admins';
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/vnd.sycomm.v1'});

  constructor(private http: HttpClient) { }

  public listPaginated(page_number: number, per_page: number): Observable<Admin[]> {
    const url = `${this.baseUrl}/list_paginated?page_number=${page_number}&per_page=${per_page}`;

    return this.http.get<Admin[]>(url);
  }

  public getById(id: number): Observable<Admin> {
    const url = `${this.baseUrl}/${id}`;

    return this.http.get<Admin>(url);
  }

  public create(admin: Admin): Observable<Admin> {
    const url = `${this.baseUrl}`;

    return this.http.post<Admin>(url, admin, { headers: this.headers });
  }

  public update(admin: Admin): Observable<Admin> {
    const url = `${this.baseUrl}/${admin.id}`;

    return this.http.put<Admin>(url, admin, { headers: this.headers });
  }

  public delete(id: number): Observable<{}  > {
    const url = `${this.baseUrl}/${id}`;

    return this.http.delete(url, { headers: this.headers});
  }

  // PRIVATE METHODS -----------------------------------------------------------

  private handleErrors(error: Response) {
    console.error('Erro em AdminService: ' + error);
    return Observable.throw(error);
  }
}
