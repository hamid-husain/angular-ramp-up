import { TestBed } from '@angular/core/testing';

import { DashboardRouteService } from './dashboard-route.service';

describe('DashboardRouteService', () => {
  let service: DashboardRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
