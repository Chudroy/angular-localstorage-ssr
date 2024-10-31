import {
  inject,
  Injectable,
  signal,
  WritableSignal
} from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, finalize, Observable, tap } from 'rxjs';
import { JWT_KEY } from 'src/app/constants';
import { LoginResponse, User } from 'src/app/models';
import { DataAccessService } from './../data-access/data-access.service';
import { StorageService } from './../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  router = inject(Router);
  storageService = inject(StorageService);
  dataAccessService = inject(DataAccessService);
  jwt = '';

  status: WritableSignal<'loading' | 'loaded' | 'error' | 'idle'> =
    signal('idle');

  user: User | null = null;

  constructor() {
    this.status.set('loading');

    const token = this.storageService.getItem<string>(JWT_KEY);

    if (token) {
      this.jwt = token;

      this.getUser()
        .pipe(
          tap((user) => {
            console.log('User: ', user);

            this.user = user;
          }),
          catchError(() => {
            console.error('Error getting user');
            return EMPTY;
          }),
          finalize(() => {
            this.status.set('loaded');
          })
        )
        .subscribe();
    } else {
      this.status.set('loaded');
    }
  }

  isLoggedIn(): boolean {
    return !!this.jwt && !!this.user;
  }

  getUser(): Observable<User | null> {
    return this.dataAccessService.requestUser(this.jwt);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.dataAccessService.requestLogin(username, password).pipe(
      tap((response) => {
        if (response.success && response.user && response.token) {
          this.setUserData(response.user, response.token);
          this.router.navigate(['/private']);
        }
      })
    );
  }

  setUserData(user: User, token: string): void {
    this.user = user;
    this.jwt = token;
    this.storageService.setItem(JWT_KEY, token);
  }

  logout(): void {
    this.user = null;
    this.jwt = '';
    localStorage.removeItem(JWT_KEY);
    this.router.navigate(['/']);
  }
}
