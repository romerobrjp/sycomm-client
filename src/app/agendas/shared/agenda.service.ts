import {throwError as observableThrowError, Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ErrorHandler, Injectable} from '@angular/core';
import {Agenda} from './agenda.model';
import {HttpClient} from '@angular/common/http';
import {APP_CONFIG} from '../../../app-config';

@Injectable()
export class AgendaService implements ErrorHandler {
  urlResource = `${APP_CONFIG.apiBaseUrl}/agendas`;

  constructor(private http: HttpClient) { }

  listLastEmployeeAgendas(userId, quant): Observable<Agenda[]> {
    const url = `${this.urlResource}`;

    return this.http.get<Agenda[]>(`${url}/list_last_emplyee_agendas?employee_id=${userId}&quant=${quant}`).pipe(
      catchError(this.handleError),
    );
  }

  listAllPaginated(page_number: number, per_page: number): Observable<Object> {
    const url = `${this.urlResource}/list_all_paginated?page_number=${page_number}&per_page=${per_page}`;

    return this.http.get<Object>(url).pipe(catchError(this.handleError));
  }

  listEmployeeAgendasPaginated(employeeId: number, page_number: number, per_page: number): Observable<Object> {
    const url = `${this.urlResource}/list_employee_agendas_paginated?employee_id=${employeeId}&page_number=${page_number}&per_page=${per_page}`;

    return this.http.get<Object>(url).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Agenda> {
    const url = `${this.urlResource}/${id}`;

    return this.http.get<Agenda>(url).pipe(
      catchError(this.handleError),
    );
  }

  create(entity: Agenda): Observable<Agenda> {
    const url = `${this.urlResource}`;

    return this.http.post<Agenda>(url, entity).pipe(
      catchError(this.handleError),
    );
  }

  update(entity: Agenda): Observable<Agenda> {
    const url = `${this.urlResource}/${entity.id}`;

    return this.http.put<Agenda>(url, entity).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<null> {
    const url = `${this.urlResource}/${id}`;

    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null),
    );
  }

  deleteAgendas(agendasIDs: number[]): Observable<null> {
    const url = `${this.urlResource}/delete-many`;
    const params = {
      'agendas_ids': agendasIDs.toString()
    };

    return this.http.delete(url, { params: params }).pipe(
      catchError(this.handleError),
      map(() => null),
    );
  }

  handleError(error) {
    console.warn('Erro em AgendaService: ', + error.message);
    return observableThrowError(error);
  }
}
