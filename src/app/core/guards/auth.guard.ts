import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServicesService } from '@modules/auth/services/auth-services.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = route => {
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
