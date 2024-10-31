import { isPlatformServer } from '@angular/common';
import { inject, Injector, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';
import { skipWhile, timeout, EMPTY, map, first } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const injector = inject(Injector);
  const platformId = inject(PLATFORM_ID);

  return toObservable(authService.status, { injector }).pipe(
    skipWhile((status) => status === 'loading'),
    timeout({
      each: 5000,
      with: () => {
        console.error(
          'Auth guard stuck: status did not change from "loading" after 5 seconds.'
        );
        return EMPTY;
      },
    }),
    map(() => {
      if (isPlatformServer(platformId)) {
        return false;
      }

      if (authService.isLoggedIn()) {
        return true;
      }

      return createUrlTreeFromSnapshot(route, ['/', 'login']);
    }),
    first()
  );
};
