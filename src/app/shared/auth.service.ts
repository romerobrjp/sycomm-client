import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from '../users/shared/user.model';
import {TokenService} from './token.service';
import {ErrorHandlerService} from './error-handler.service';

@Injectable()
export class AuthService {
  constructor(private tokenService: TokenService, private errorHandlerService: ErrorHandlerService) {}

  signUp(user: User): Observable<Response> {
    return this.tokenService.registerAccount(user as any).catch(ErrorHandlerService.handleResponseErrors);
  }

  signIn(uid: string, password: string): Observable<Response> {
    const signInData = {
      email: uid,
      password: password
    };

    return this.tokenService.signIn(signInData).catch(ErrorHandlerService.handleResponseErrors);
  }

  signOut(): Observable<Response> {
    return this.tokenService.signOut().catch(ErrorHandlerService.handleResponseErrors);
  }

  userSignedIn(): boolean {
    return this.tokenService.userSignedIn();
  }

  getCurrentUser() {
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

  currentUser(): Observable<User> {
    return this.tokenService.validateToken().map(
      res => res.json()['data'] as User
    );
  }

  handleErrors(error: Response) {
    console.log('AuthService.handleErrors: ', error);
    return Observable.throw(error);
  }
}
