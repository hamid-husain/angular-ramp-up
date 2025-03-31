import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { constants } from '@app/app.constants';
import { AuthServicesService } from '@modules/auth/services/auth-services.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = route => {
  const authService = inject(AuthServicesService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    map(user => {
      if (user) {
        if (route.routeConfig?.path == constants.PATH_AUTH) {
          router.navigate([constants.ROUTE_DASHBOARD]);
          return false;
        }
        return true;
      } else {
        if (route.routeConfig?.path == constants.PATH_AUTH) {
          return true;
        }
        router.navigate([constants.ROUTE_LOGIN]);
        return false;
      }
    })
  );
};
