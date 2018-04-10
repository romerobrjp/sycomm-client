import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Role } from './role';

@Injectable()
export class RoleService {
  public baseUrl = 'http://api.sycomm.com:3000/roles';
  private headers = new Headers({'Content-Type': 'application/json', 'Accept': 'application/vnd.sycomm.v1'});

  constructor(private http: Http) { }

  public getAll(): Observable<Role[]> {
    return this.http.get(`${this.baseUrl}`, {headers: this.headers})
      .catch(this.handleErrors)
      .map((response: Response) => this.responseToRoles(response));
  }

  private handleErrors(error: Response) {
    console.error('Erro em RoleService: ' + error);
    return Observable.throw(error);
  }

  private responseToRoles(response: Response): Array<Role> {
    const roles: Role[] = [];

    response.json().forEach(item => {
      roles.push(item as Role);
    });
    return roles;
  }
}
