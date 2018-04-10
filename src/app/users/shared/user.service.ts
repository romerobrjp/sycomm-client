import { Response, Http, Headers } from '@angular/http';
// import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { User } from './user';

@Injectable()
export class UserService {
  public baseUrl = 'http://api.sycomm.com:3000/users';
  private headers = new Headers({'Content-Type': 'application/json', 'Accept': 'application/vnd.sycomm.v1'});

  constructor(private http: Http) { }

  public getAll(): Observable<User[]> {
    return this.http.get(`${this.baseUrl}`, {headers: this.headers})
      .catch(this.handleErrors)
      .map((response: Response) => this.responseToUsers(response));
  }

  public getById(id: number): Observable<User> {
    const url = `${this.baseUrl}/${id}`;

    return this.http.get(url)
      .catch(this.handleErrors)
      .map((response: Response) => response.json() as User);
  }

  public update(user: User): Observable<User> {
    const url = `${this.baseUrl}/${user.id}`;
    const body = JSON.stringify(user);

    return this.http.put(url, body,{headers: this.headers})
      .catch(this.handleErrors)
      .map(() => user);
  }

  // PRIVATE METHODS -----------------------------------------------------------

  private handleErrors(error: Response) {
    console.error('Erro em UserService: ' + error);
    return Observable.throw(error);
  }

  private responseToUsers(response: Response): Array<User> {
    const users: User[] = [];

    response.json().forEach(item => {
      users.push(item as User);
    });

    return users;
  }
}
