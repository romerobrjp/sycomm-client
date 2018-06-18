import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { PublicAgency } from './public_agency.model';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class PublicAgencyService {
  public baseUrl = 'http://api.sycomm.com:3000/public_agencies';
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/vnd.sycomm.v1'});

  constructor(private http: HttpClient) { }

  public getAll(): Observable<PublicAgency[]> {
    return this.http.get<PublicAgency[]>(this.baseUrl, {headers: this.headers});
  }
}
