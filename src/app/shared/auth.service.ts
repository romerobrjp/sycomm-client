import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from '../users/shared/user.model';
import {TokenService} from './token.service';
import {ErrorHandlerService} from './error-handler.service';
import {SignInData} from 'angular2-token';
import {tap} from 'rxjs/operators';

@Injectable()
export class AuthService {
  private currentUser: User;

  constructor(private tokenService: TokenService, private errorHandlerService: ErrorHandlerService) {
    this.refreshCurrentUser();
  }

  signUp(user: User): Observable<Response> {
    return this.tokenService.registerAccount(user as any).catch(ErrorHandlerService.handleResponseErrors);
  }

  signIn(uid: string, password: string): Observable<Response> {
    const signInData = {
      email: uid,
      password: password
    };

    return this.tokenService.signIn(signInData).map(
      res => (this.currentUser = res.json()['data'] as User)
    ).catch(ErrorHandlerService.handleResponseErrors);
  }

  signOut(): Observable<Response> {
    return this.tokenService.signOut().catch(ErrorHandlerService.handleResponseErrors);
  }

  userSignedIn(): boolean {
    return this.tokenService.userSignedIn();
  }

  getCurrentUser(): User {
    if (this.currentUser === null || this.currentUser === undefined) {
      this.refreshCurrentUser();
    }
    return this.currentUser;
  }

  // vai buscar no servidor via validateToken()
  fetchCurrentUser(): Observable<User> {
    return this.tokenService.validateToken().map(
      res => res.json()['data'] as User
    );
  }

  refreshCurrentUser(): void {
    this.fetchCurrentUser().subscribe(
      retrievedCurrentUser => {
        this.currentUser = retrievedCurrentUser;
      }
    );
  }

  isAdmin(): boolean {
    return this.getCurrentUser()['type'] === 'Admin';
  }

  isEmployee(): boolean {
    return this.getCurrentUser()['type'] === 'Employee';
  }

  isCustomer(): boolean {
    return this.getCurrentUser()['type'] === 'Customer';
  }
}
