import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {PublicOffice} from './public_office.model';
import {TokenService} from '../../shared/token.service';

@Injectable()
export class PublicOfficeService {
  public resourceUrl = '/public_offices';

  constructor(private http: TokenService) { }

  public getAll(): Observable<PublicOffice[]> {
    return this.http.get(this.resourceUrl).catch(null).map((response: Response) => this.responseToModels(response));
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
