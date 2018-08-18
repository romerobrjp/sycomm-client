import {throwError as observableThrowError, Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Agenda} from './agenda.model';
import {RequestOptions, Response} from '@angular/http';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AgendaService {
  urlResource = 'agendas';

  constructor(private http: HttpClient) { }

  listLastEmployeeAgendas(userId, quant): Observable<Agenda[]> {
    const url = `${this.urlResource}`;

    return this.http.get(`${url}/list_last_emplyee_agendas?employee_id=${userId}&quant=${quant}`).pipe(
      catchError(this.handleErrors),
      map((response: Response) => this.responseToModels(response)),
    );
  }

  listAllPaginated(page_number: number, per_page: number): Observable<any> {
    const url = `${this.urlResource}/list_all_paginated?page_number=${page_number}&per_page=${per_page}`;

    return this.http.get(url).pipe(catchError(this.handleErrors));
  }

  listEmployeeAgendasPaginated(employeeId: number, page_number: number, per_page: number): Observable<any> {
    const url = `${this.urlResource}/list_employee_agendas_paginated?employee_id=${employeeId}&page_number=${page_number}&per_page=${per_page}`;

    return this.http.get(url).pipe(catchError(this.handleErrors));
  }

  getById(id: number): Observable<Agenda> {
    const url = `${this.urlResource}/${id}`;

    // return this.http.get<Agenda>(url).pipe(
    //   catchError(this.handleErrors),
    //   map((response: Response) => this.responseToModel(response))
    // );
    return this.http.get<Agenda>(url);
  }

  create(entity: Agenda): Observable<Agenda> {
    const url = `${this.urlResource}`;

    // return this.http.post(url, entity).pipe(
    //   map((response: Response) => this.responseToModel(response)),
    //   catchError(this.handleErrors),
    // );

    return this.http.post<Agenda>(url, entity);
  }

  update(entity: Agenda): Observable<Agenda> {
    const url = `${this.urlResource}/${entity.id}`;

    return this.http.put(url, entity).pipe(
      catchError(this.handleErrors),
      map((response: Response) => this.responseToModel(response))
    );
  }

  delete(id: number): Observable<null> {
    const url = `${this.urlResource}/${id}`;

    return this.http.delete(url).pipe(
      catchError(this.handleErrors),
      map(() => null),
    );
  }

  deleteAgendas(agendasIDs: number[]) {
    // const url = `${this.urlResource}/delete-many`;
    // const params = {
    //   'agendas_ids': agendasIDs.toString()
    // };
    // const requestOptions = new RequestOptions({ body: params });
    //
    // return this.http.delete(url, {body: requestOptions}).pipe(
    //   catchError(this.handleErrors),
    //   map(() => null),
    // );
  }

  private responseToModel(response: Response): Agenda {
    const jsonEntity = response.json();

    const customersCpf: Array<string> = jsonEntity['customers'].map(c => c.cpf);

    return new Agenda(
      jsonEntity['id'],
      jsonEntity['name'],
      jsonEntity['start_date'],
      jsonEntity['end_date'],
      jsonEntity['employee_id'],
      jsonEntity['employee'],
      jsonEntity['customers'],
      customersCpf,
      jsonEntity['created_at'],
      jsonEntity['updated_at'],
      jsonEntity['activities'],
      jsonEntity['open_activities_count'],
    );
  }

  private responseToModels(response: Response): Array<Agenda> {
    const collection = response.json()['data'] as Array<any>;
    const items: Agenda[] = [];

    collection.forEach(jsonEntity => {
      const customersCpf: Array<string> = jsonEntity['customers'].map(c => c.cpf);

      const item = new Agenda(
        jsonEntity['id'],
        jsonEntity['name'],
        jsonEntity['start_date'],
        jsonEntity['end_date'],
        jsonEntity['employee_id'],
        jsonEntity['employee'],
        jsonEntity['customers'],
        customersCpf,
        jsonEntity['created_at'],
        jsonEntity['updated_at'],
        jsonEntity['activities'],
        jsonEntity['open_activities_count'],
      );

      items.push(item);
    });

    return items;
  }

  private handleErrors(error: Response) {
    console.error('Erro em AgendaService: ' + error);
    return observableThrowError(error);
  }
}
