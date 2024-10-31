import { Injectable } from '@angular/core';
import { Observable, of, take } from 'rxjs';
import { LoginResponse, User } from 'src/app/models';

@Injectable({
  providedIn: 'root',
})
export class DataAccessService {
  token = 'jwt-token';

  user: User = {
    username: 'user',
    email: 'user@test.com',
  };

  userTokenMap = new Map<string, User>();

  validUser = 'user';
  validPassword = '1234';

  constructor() {
    this.userTokenMap.set(this.token, this.user);
  }

  requestLogin(username: string, password: string): Observable<LoginResponse> {
    const isLoginValid =
      username === this.validUser && password === this.validPassword;

    if (isLoginValid) {
      return of({
        success: true,
        user: this.user,
        token: this.token,
      }).pipe(take(1));
    } else {
      return of({
        success: false,
      }).pipe(take(1));
    }
  }

  /*
   * This method is used to get the user details
   * based on the jwt token
   */
  requestUser(jwt: string): Observable<User | null> {
    const user = this.userTokenMap.get(jwt) || null;

    return of(user);
  }
}
