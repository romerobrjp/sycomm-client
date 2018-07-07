
import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
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
        // console.log(`signIn res.json(): ${JSON.stringify(res.json())}`);
        return (this.currentUser = res.json()['data'] as User)
      }),
      catchError(ErrorHandlerService.handleResponseErrors)
    );
  }

  signOut(): Observable<Response> {
    return this.tokenService.signOut().pipe(catchError(ErrorHandlerService.handleResponseErrors));
  }

  userSignedIn(): boolean {
    return this.tokenService.userSignedIn();
  }

  getCurrentUser(): User {
    // return this.currentUser;
    if (this.currentUser) {
      console.log(`this.currentUser ja existe: ${JSON.stringify(this.currentUser)}`);
      return this.currentUser;
    }
    else {
      this.tokenService.validateToken().subscribe(
        (success) => {
          console.log(`response.json()['data']: ${success.json()['data']}`);
          this.currentUser = success.json()['data'] as User;
          return this.currentUser;
        },
        (error) => {
          console.log(`error.json(): ${error.json()}`);
        }
      );
    }
  }

  // refreshCurrentUser(): void {
  //   this.tokenService.validateToken().pipe(
  //     map(
  //       res => {
  //         console.log(`refreshCurrentUser response.json()['data']: ${res.json()['data']}`);
  //         this.currentUser = res.json()['data'] as User;
  //       }
  //     )
  //   );
  // }

  isAdmin(): boolean {
    console.log(`this.isAdmin: ${JSON.stringify(this.getCurrentUser())}`);
    return this.getCurrentUser().type === 'Admin';
  }

  isEmployee(): boolean {
    console.log(`this.isEmployee: ${JSON.stringify(this.getCurrentUser())}`);
    return this.getCurrentUser().type === 'Employee';
  }

  isCustomer(): boolean {
    console.log(`this.isCustomer: ${JSON.stringify(this.getCurrentUser())}`);
    return this.getCurrentUser().type === 'Customer';
  }
}
