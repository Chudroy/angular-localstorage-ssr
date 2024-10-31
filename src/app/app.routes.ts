import { Route } from '@angular/router';
import { PublicComponent } from './components/public/public.component';
import { PrivateComponent } from './components/private/private.component';
import { authGuard } from './guards/auth/auth.guard';
import { LoginComponent } from './components/login/login.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: PublicComponent,
  },
  {
    path: 'private',
    component: PrivateComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
