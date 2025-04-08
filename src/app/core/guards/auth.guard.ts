import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { map } from 'rxjs';

import { constants } from '@app/app.constants';
import { AuthService } from '@shared/authServices/auth.service';

export const authGuard: CanActivateFn = route => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    map(user => {
      if (user) {
        if (route.routeConfig?.path === constants.PATH_AUTH) {
          router.navigate([constants.ROUTES.DASHBOARD]);
          return false;
        }
        return true;
      } else {
        if (route.routeConfig?.path == constants.PATH_AUTH) {
          return true;
        }
        router.navigate([constants.ROUTES.LOGIN]);
        return false;
      }
    })
  );
};
