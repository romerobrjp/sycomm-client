import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from '../users/shared/user.model';
import {TokenService} from './token.service';
import {tap} from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(private tokenService: TokenService) {}

  signUp(user: User): Observable<Response> {
    return this.tokenService.registerAccount(user as any).catch(this.handleErrors);
  }

  signIn(uid: string, password: string): Observable<Response> {
    const signInData = {
      email: uid,
      password: password
    };

    return this.tokenService.signIn(signInData).pipe(
      tap(
        responseSuccess => {
          const currentUser = JSON.parse(responseSuccess['_body']).data;
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
        },
        responseError => {
          this.handleErrors(responseError);
        }
      )
    ).catch(this.handleErrors);
  }

  signOut(): Observable<Response> {
    return this.tokenService.signOut().catch(this.handleErrors);
  }

  userSignedIn(): boolean {
    return this.tokenService.userSignedIn();
  }

  handleErrors(error: Response) {
    console.log('AuthService.handleErrors: ', error);
    return Observable.throw(error);
  }

  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  isAdmin(): boolean {
    return this.getCurrentUser().type === 'Admin';
  }

  isEmployee(): boolean {
    return this.getCurrentUser().type === 'Employee';
  }

  isCustomer(): boolean {
    return this.getCurrentUser().type === 'Customer';
  }

  updateCurrentUser(u: User): void {
    localStorage.setItem('currentUser', JSON.stringify(u));
  }
}
