import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {PublicAgency} from './public_agency.model';
import {TokenService} from '../../shared/token.service';

@Injectable()
export class PublicAgencyService {
  public resourceUrl = '/public_agencies';

  constructor(private http: TokenService) { }

  public getAll(): Observable<PublicAgency[]> {
    return this.http.get(this.resourceUrl).catch(null).map((response: Response) => this.responseToModels(response));
  }

  private responseToModels(response: Response): Array<PublicAgency> {
    const collection = response.json()['data'] as Array<any>;
    const items: PublicAgency[] = [];

    collection.forEach(jsonEntity => {
      const item = new PublicAgency(
        jsonEntity['id'],
        jsonEntity['name'],
        jsonEntity['description'],
      );

      items.push(item);
    });

    return items;
  }
}
