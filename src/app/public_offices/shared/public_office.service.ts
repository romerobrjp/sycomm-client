import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { PublicOffice } from './public_office.model';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class PublicOfficeService {
  public baseUrl = 'http://api.sycomm.com:3000/public_offices';
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/vnd.sycomm.v1'});

  constructor(private http: HttpClient) { }

  public getAll(): Observable<PublicOffice[]> {
    return this.http.get<PublicOffice[]>(this.baseUrl, {headers: this.headers});
  }
}
