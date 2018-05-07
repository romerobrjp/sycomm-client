import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from '../users/shared/user.model';
import {TokenService} from './token.service';

@Injectable()
export class AuthService {

  public constructor(private tokenService: TokenService) {

  }

  public signUp(user: User): Observable<Response> {
    return this.tokenService.registerAccount(user as any).catch(this.handleErrors);
  }

  public signIn(uid: string, password: string): Observable<Response> {
    const signInData = {
      email: uid,
      password: password
    };

    return this.tokenService.signIn(signInData).catch(this.handleErrors);
  }

  public signOut(): Observable<Response> {
    return this.tokenService.signOut().catch(this.handleErrors);
  }

  public userSignedIn(): boolean {
    return this.tokenService.userSignedIn();
  }

  public handleErrors(error: Response) {
    console.log('AuthService.handleErrors: ', error);
    return Observable.throw(error);
  }

}
