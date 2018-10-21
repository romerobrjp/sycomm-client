import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';
import {AuthService} from './auth.service';
import swal from 'sweetalert2';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // send the newly created request
    return next.handle(req).pipe(
      catchError(
        (reqError) => {
          if (reqError.status === 401 && reqError.error.errors[0] !== 'E-mail ou senha inválidos.') {
            // auto logout if 401 response returned from api
            swal('Atenção', 'Sua sessão expirou. Por favor, autentique-se novamente.', 'warning');
            this.authService.signOut();
            // location.reload(true);
          }
          // const err = error.error.message || error.statusText;
          return throwError(reqError);
        }
      )
    );
  }
}
