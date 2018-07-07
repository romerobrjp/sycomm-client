
import {map, catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PublicOffice} from './public_office.model';
import {TokenService} from '../../shared/token.service';

@Injectable()
export class PublicOfficeService {
  public resourceUrl = '/public_offices';

  constructor(private http: TokenService) { }

  public getAll(): Observable<PublicOffice[]> {
    return this.http.get(this.resourceUrl).pipe(catchError(null),map((response: Response) => this.responseToModels(response)),);
  }

  private responseToModels(response: Response): Array<PublicOffice> {
    const collection = response.json()['data'] as Array<any>;
    const items: PublicOffice[] = [];

    collection.forEach(jsonEntity => {
      const item = new PublicOffice(
        jsonEntity['id'],
        jsonEntity['name'],
        jsonEntity['description'],
      );

      items.push(item);
    });

    return items;
  }
}
