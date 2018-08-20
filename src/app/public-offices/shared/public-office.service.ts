import {map, catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PublicOffice} from './public-office.model';
import {throwError as observableThrowError} from 'rxjs/index';
import { HttpClient } from '@angular/common/http';
import {APP_CONFIG} from '../../../app-config';

@Injectable()
export class PublicOfficeService {
  public resourceUrl = `${APP_CONFIG.apiBaseUrl}/public_offices`;

  constructor(private http: HttpClient) { }

  public getAll(): Observable<PublicOffice[]> {
    return this.http.get<PublicOffice[]>(this.resourceUrl);
  }

  listPaginated(page_number: number,
                per_page: number,
                sortField: string,
                sortDirection: string,
                searchField: string,
                searchText: string): Observable<Object> {
    const url = `${this.resourceUrl}/list_paginated?page_number=${page_number}&per_page=${per_page}&sortField=${sortField}&sortDirection=${sortDirection}&searchField=${searchField}&searchText=${searchText}`;

    return this.http.get(url).pipe(
      catchError(this.handleErrors)
    );
  }

  getById(id: number): Observable<PublicOffice> {
    const url = `${this.resourceUrl}/${id}`;

    return this.http.get<PublicOffice>(url).pipe(
      catchError(this.handleErrors),
    );
  }

  create(model: PublicOffice): Observable<PublicOffice> {
    const url = `${this.resourceUrl}`;

    return this.http.post<PublicOffice>(url, model).pipe(
      catchError(this.handleErrors),
    );
  }

  update(model: PublicOffice): Observable<PublicOffice> {
    const url = `${this.resourceUrl}/${model.id}`;

    return this.http.put<PublicOffice>(url, model).pipe(
      catchError(this.handleErrors),
    );
  }

  delete(id: number): Observable<null> {
    const url = `${this.resourceUrl}/${id}`;

    return this.http.delete(url).pipe(
      catchError(this.handleErrors),
      map(() => null),
    );
  }

  // PRIVATE METHODS -----------------------------------------------------------

  private handleErrors(error: Response) {
    console.error('Erro em UserService: ' + error);
    return observableThrowError(error);
  }
}
