import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../users/shared/user.model';
import {ErrorHandlerService} from './error-handler.service';
import {HttpResponse} from '@angular/common/http';
import {tap} from 'rxjs/internal/operators';
import {AngularTokenService} from 'angular-token';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {
  private currentUser: User;

  constructor(private tokenService: AngularTokenService, private router: Router) {}

  signUp(login: string, password: string, passwordConfirmation: string): Observable<User> {
    const registerData = {
      login: login,
      password: password,
      passwordConfirmation: passwordConfirmation
    };

    return this.tokenService.registerAccount(registerData).pipe(
      catchError(ErrorHandlerService.handleResponseErrors)
    );
  }

  signIn(uid: string, password: string): Observable<Object> {
    const signInData = {
      login: uid,
      password: password
    };

    return this.tokenService.signIn(signInData).pipe(
      tap(
        (responseSuccess: HttpResponse<Object>) => {
          this.currentUser = responseSuccess.body['data'] as User;
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
      ),
      catchError(ErrorHandlerService.handleResponseErrors)
    );
  }

  signOut(): void {
    localStorage.removeItem('currentUser');
    this.tokenService.signOut().subscribe(
      (responseSuccess) => {
        this.router.navigate(['/sign-in']);
      },
      (responseError) => {
        console.error(JSON.stringify(responseError));
      }
    );
  }

  userSignedIn(): boolean {
    // console.log(this.tokenService.userSignedIn());
    // return this.tokenService.userSignedIn();
    if (localStorage.getItem('currentUser')) {
      return true;
    }
    return false;
  }

  validateToken() {
    this.tokenService.validateToken().subscribe(
      res => {
        console.log(res);
      },
      error => {
        console.error(error);
      }
    );
  }

  getCurrentUser(): User {
    if (!this.currentUser) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser')) as User;
    }
    return this.currentUser;
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
