import { Response, Http, Headers } from '@angular/http';
// import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { User } from './user.model';

@Injectable()
export class UserService {
  public baseUrl = 'http://api.sycomm.com:3000';
  private headers = new Headers({'Content-Type': 'application/json', 'Accept': 'application/vnd.sycomm.v1'});

  constructor(private http: Http) { }

  public getAll(): Observable<User[]> {
    return this.http.get(`${this.baseUrl}/users`, {headers: this.headers})
      .catch(this.handleErrors)
      .map((response: Response) => {
        return response.json() as User[];
      });

    // return this.http.get(`${this.baseUrl}/users`, {headers: this.headers})
    //   .catch(this.handleErrors)
    //   .map((response: Response) => this.responseToUsers(response));
  }

  // PRIVATE METHODS -----------------------------------------------------------

  private handleErrors(error: Response) {
    console.error('Erro em UserSvice: ' + error);
    return Observable.throw(error);
  }

  private responseToUsers(response: Response): Array<User> {
    const collection = response.json().data as Array<any>;
    console.log(collection);
    const users: User[] = [];

    collection.forEach(item => {
      const user = new User(
        item.id,
        item.attributes.registration,
        item.attributes.name,
        item.attributes.surname,
        item.attributes.nickname,
        item.attributes.email,
        item.attributes.password,
        item.attributes.password_confirmation,
        item.attributes.cpf,
        item.attributes.landline,
        item.attributes.cellphone,
        item.attributes.whatsapp,
        item.attributes.simple_address,
        item.attributes.type,
        item.attributes.organization_id,
        item.attributes.role_id,
        item.attributes.address_id,
        item.attributes.created_at,
        item.attributes.auth_token
      );

      users.push(user);
    });

    return users;
  }
}
