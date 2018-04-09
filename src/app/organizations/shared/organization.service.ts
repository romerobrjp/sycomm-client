import { Injectable } from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Organization} from './organization';

@Injectable()
export class OrganizationService {
  public baseUrl = 'http://api.sycomm.com:3000/organizations';
  private headers = new Headers({'Content-Type': 'application/json', 'Accept': 'application/vnd.sycomm.v1'});

  constructor(private http: Http) { }

  public getAll(): Observable<Organization[]> {
    return this.http.get(`${this.baseUrl}`, {headers: this.headers})
      .catch(this.handleErrors)
      .map((response: Response) => this.responseToOrganizations(response));
  }

  private handleErrors(error: Response) {
    console.error('Erro em OrganizationService: ' + error);
    return Observable.throw(error);
  }

  private responseToOrganizations(response: Response): Array<Organization> {
    const organizations: Organization[] = [];

    response.json().forEach(item => {
      organizations.push(item as Organization);
    });
    return organizations;
  }
}
