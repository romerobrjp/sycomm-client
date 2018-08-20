import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/index';
import {Loader} from './loader';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loaderSubject = new Subject<Loader>();
  loaderState = this.loaderSubject.asObservable();

  constructor() {}

  show() {
    this.loaderSubject.next(<Loader>{ show: true });
  }

  hide() {
    this.loaderSubject.next(<Loader>{ show: false });
  }
}
