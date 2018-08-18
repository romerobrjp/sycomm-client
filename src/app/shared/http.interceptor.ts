import { Injectable } from '@angular/core';

// operators
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor() {
    console.log(`interceptor constructor`);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // send the newly created request
    console.log(`VAI KCTAAAAAAAAAAAAAAA`);
    return next.handle(req)
      .pipe(
        catchError((error, caught) => {
            return this.handleError(error);
          }
        )
      ) as any;
  }

  private handleError = (error: Response) => {
    console.error('An error has occurred: ' + error);
    // Do messaging and error handling here
    return throwError(error);
  }
}
