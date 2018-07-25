
import {throwError as observableThrowError, Observable} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Agenda} from './agenda.model';
import {TokenService} from '../../shared/token.service';
import {Response} from '@angular/http';

@Injectable()
export class AgendaService {
  urlResource = 'agendas';

  constructor(private http: TokenService) { }

  listLastUserAgendas(userId, quant): Observable<Agenda[]> {
    const url = `${this.urlResource}`;

    return this.http.get(`${url}/list_last_user_agendas?user_id=${userId}&quant=${quant}`).pipe(
      catchError(this.handleErrors),
      map((response: Response) => this.responseToModels(response)),
    );
  }

  listAllPaginated(page_number: number, per_page: number): Observable<Response> {
    const url = `${this.urlResource}/list_all_paginated?page_number=${page_number}&per_page=${per_page}`;

    return this.http.get(url).pipe(catchError(this.handleErrors));
  }

  listUserAgendasPaginated(userId: number, page_number: number, per_page: number): Observable<Response> {
    const url = `${this.urlResource}/list_user_agendas_paginated?user_id=${userId}&page_number=${page_number}&per_page=${per_page}`;

    return this.http.get(url).pipe(catchError(this.handleErrors));
  }

  getById(id: number): Observable<Agenda> {
    const url = `${this.urlResource}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleErrors),
      map((response: Response) => this.responseToModel(response))
    );
  }

  create(entity: Agenda): Observable<Agenda> {
    const url = `${this.urlResource}`;

    return this.http.post(url, entity).pipe(
      map((response: Response) => this.responseToModel(response)),
      catchError(this.handleErrors),
    );
  }

  update(entity: Agenda): Observable<Agenda> {
    const url = `${this.urlResource}/${entity.id}`;

    return this.http.put(url, entity).pipe(
      catchError(this.handleErrors),
      map((response: Response) => this.responseToModel(response))
    );
  }

  private responseToModel(response: Response): Agenda {
    const jsonEntity = response.json();

    return new Agenda(
      jsonEntity['id'],
      jsonEntity['name'],
      jsonEntity['start_date'],
      jsonEntity['employee_id'],
      jsonEntity['customers_cpf'],
      jsonEntity['created_at'],
      jsonEntity['updated_at'],
    );
  }

  private responseToModels(response: Response): Array<Agenda> {
    const collection = response.json()['data'] as Array<any>;
    const items: Agenda[] = [];

    collection.forEach(jsonEntity => {
      const item = new Agenda(
        jsonEntity['id'],
        jsonEntity['name'],
        jsonEntity['start_date'],
        jsonEntity['employee_id'],
        jsonEntity['customers_cpf'],
        jsonEntity['created_at'],
        jsonEntity['updated_at'],
      );

      items.push(item);
    });

    return items;
  }

  private handleErrors(error: Response) {
    console.error('Erro em UserService: ' + error);
    return observableThrowError(error);
  }
}
