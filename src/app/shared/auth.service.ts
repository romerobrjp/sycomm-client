
import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../users/shared/user.model';
import {TokenService} from './token.service';
import {ErrorHandlerService} from './error-handler.service';
import {Response} from '@angular/http';

@Injectable()
export class AuthService {
  private currentUser: User;

  constructor(private tokenService: TokenService) {}

  signUp(user: User): Observable<Response> {
    return this.tokenService.registerAccount(user as any).pipe(catchError(ErrorHandlerService.handleResponseErrors));
  }

  signIn(uid: string, password: string): Observable<User> {
    const signInData = {
      email: uid,
      password: password
    };

    return this.tokenService.signIn(signInData).pipe(
      map(res => {
        let user: User = res.json()['data'] as User;

        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      }),
      catchError(ErrorHandlerService.handleResponseErrors)
    );
  }

  signOut(): Observable<Response> {
    localStorage.removeItem('currentUser');
    return this.tokenService.signOut().pipe(catchError(ErrorHandlerService.handleResponseErrors));
  }

  userSignedIn(): boolean {
    return this.tokenService.userSignedIn();
  }

  getCurrentUser(): User {
    if (!this.currentUser) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser')) as User;
    }
    return this.currentUser;
    // else {
    //   return this.tokenService.validateToken().subscribe(
    //     (success) => {
    //       console.log(`this.currentUser nao existe, recupera do back: ${JSON.stringify(success.json()['data'])}`);
    //       this.currentUser = success.json()['data'] as User;
    //       return success.json()['data'];
    //     },
    //     (error) => console.error(`Deu merda no getCurrenUser: ${error}`)
    //   );
    // }
  }

  updateCurrentUser(currentUser) {
    this.currentUser = currentUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }

  refreshCurrentUser() {
    this.tokenService.validateToken().subscribe(
      (success) => {
        this.currentUser = success.json()['data'] as User;
        this.updateCurrentUser(this.currentUser);
      },
      (error) => console.error(`Deu erro no refreshCurrenUser(): ${error}`)
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
