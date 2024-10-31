import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-private',
  standalone: true,
  imports: [],
  templateUrl: './private.component.html',
  styleUrl: './private.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivateComponent {
  authService = inject(AuthService);

  constructor() {
    console.log('PRIVATE AREA');
    
  }

  logOut() {
    this.authService.logout();
  }
}
