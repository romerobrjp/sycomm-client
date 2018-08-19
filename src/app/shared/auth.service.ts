import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../users/shared/user.model';
import {HttpClient} from './token.service';
import {ErrorHandlerService} from './error-handler.service';
import {HttpResponse} from '@angular/common/http';
import {tap} from 'rxjs/internal/operators';

@Injectable()
export class AuthService {
  private currentUser: User;

  constructor(private tokenService: HttpClient) {}

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
    this.tokenService.signOut().subscribe(
      (responseSuccess) => {
        localStorage.removeItem('currentUser');
        console.log(JSON.stringify(responseSuccess));
      },
      (responseError) => {
        console.error(JSON.stringify(responseError));
      }
    );
  }

  userSignedIn(): boolean {
    console.log(`this.tokenService.userSignedIn(): ${this.tokenService.userSignedIn()}`);
    return this.tokenService.userSignedIn();
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
