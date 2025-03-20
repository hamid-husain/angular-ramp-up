import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { AuthServicesService } from '../../modules/auth/services/auth-services.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServicesService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    map(user => {
      if (user) {
        if (route.routeConfig?.path == 'auth') {
          router.navigate(['/dashboard']);
          return false;
        }
        return true;
      } else {
        if (route.routeConfig?.path == 'auth') {
          return true;
        }
        router.navigate(['/auth/login']);
        return false;
      }
    })
  );
};
