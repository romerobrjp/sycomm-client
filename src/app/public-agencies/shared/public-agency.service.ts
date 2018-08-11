import {map, catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PublicAgency} from './public-agency.model';
import {TokenService} from '../../shared/token.service';
import {Response} from '@angular/http';
import {throwError as observableThrowError} from 'rxjs/index';

@Injectable()
export class PublicAgencyService {
  public resourceUrl = '/public_agencies';

  constructor(private http: TokenService) { }

  public getAll(): Observable<PublicAgency[]> {
    return this.http.get(this.resourceUrl).pipe(
      map((response: Response) => this.responseToModels(response)),
      catchError(null),
    );
  }

  listPaginated(page_number: number,
                per_page: number,
                sortField: string,
                sortDirection: string,
                searchField: string,
                searchText: string): Observable<Response>
  {
    const url = `${this.resourceUrl}/list_paginated?page_number=${page_number}&per_page=${per_page}&sortField=${sortField}&sortDirection=${sortDirection}&searchField=${searchField}&searchText=${searchText}`;

    return this.http.get(url).pipe(
      map((response: Response) => response),
      catchError(this.handleErrors)
    );
  }

  getById(id: number): Observable<PublicAgency> {
    const url = `${this.resourceUrl}/${id}`;

    return this.http.get(url).pipe(
      map((response: Response) => this.responseToModel(response)),
      catchError(this.handleErrors),
    );
  }

  create(model: PublicAgency): Observable<PublicAgency> {
    const url = `${this.resourceUrl}`;

    return this.http.post(url, model).pipe(
      map((response: Response) => this.responseToModel(response)),
      catchError(this.handleErrors),
    );
  }

  update(model: PublicAgency): Observable<PublicAgency> {
    const url = `${this.resourceUrl}/${model.id}`;

    return this.http.put(url, model).pipe(
      catchError(this.handleErrors),
      map((response: Response) => this.responseToModel(response)),
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

  private responseToModel(response: Response): PublicAgency {
    const modelJson = response.json();

    return new PublicAgency(
      modelJson['id'],
      modelJson['name'],
      modelJson['description']
    );
  }

  private responseToModels(response: Response): Array<PublicAgency> {
    const collection = response.json()['data'] as Array<any>;
    const items: PublicAgency[] = [];

    collection.forEach(modelJson => {
      const item = new PublicAgency(
        modelJson['id'],
        modelJson['name'],
        modelJson['description'],
      );

      items.push(item);
    });

    return items;
  }
}
