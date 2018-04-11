import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Role } from './role';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class RoleService {
  public baseUrl = 'http://api.sycomm.com:3000/roles';
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/vnd.sycomm.v1'});

  constructor(private http: HttpClient) { }

  public getAll(): Observable<Role[]> {
    return this.http.get<Role[]>(this.baseUrl, {headers: this.headers})
      .pipe(
        tap(users => console.log(users)),
        catchError(this.handleErrors)
      );
  }

  private handleErrors(error: Response) {
    console.error('Erro em RoleService: ' + error);
    return Observable.throw(error);
  }
}
