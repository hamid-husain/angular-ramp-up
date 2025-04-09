import { Injectable } from '@angular/core';

import { constants } from '@app/app.constants';

@Injectable({
  providedIn: 'root',
})
export class DashboardRouteService {
  private URL = [constants.ROUTES.DASHBOARD];
  private params: Record<string, undefined> | null = null;

  setDashboardRoute(url: string[], param: Record<string, undefined> | null) {
    this.URL = url;
    this.params = param;
  }

  getDashboardRoute(): {
    url: string[];
    queryParams?: Record<string, undefined>;
  } {
    return {
      url: this.URL,
      queryParams: this.params ?? undefined,
    };
  }

  resetDashboardRoute() {
    this.URL = [constants.ROUTES.DASHBOARD];
    this.params = null;
  }
}
