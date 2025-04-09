import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { map } from 'rxjs';

import { constants } from '@app/app.constants';
import { AuthService } from '@app/shared/services/authServices/auth.service';
import { DashboardRouteService } from '@app/shared/services/dashboardRouteServices/dashboard-route.service';

export const authGuard: CanActivateFn = route => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const dashboardRoute = inject(DashboardRouteService);

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

        let lastChild = route;
        while (lastChild.firstChild) {
          lastChild = lastChild.firstChild;
        }

        const path = lastChild.pathFromRoot
          .flatMap(r => r.url.map(u => u.path))
          .filter(Boolean);
        console.log(path);
        const queryParams = route.queryParams;
        console.log(path);
        console.log(queryParams);
        dashboardRoute.setDashboardRoute(path, queryParams);
        router.navigate([constants.ROUTES.LOGIN]);
        return false;
      }
    })
  );
};
