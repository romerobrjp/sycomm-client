import { Injectable } from '@angular/core';

// operators
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';
import {AuthService} from './auth.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // send the newly created request
    return next.handle(req).pipe(
      catchError(
        (error) => {
          if (error.status === 401) {
            // auto logout if 401 response returned from api
            this.authService.signOut();
            location.reload(true);
          }
          const err = error.error.message || error.statusText;
          return throwError(err);
        }
      )
    );
  }

  private handleError = (error: Response) => {
    console.error('An error has occurred: ' + error);
    // Do messaging and error handling here
    return throwError(error);
  }
}
