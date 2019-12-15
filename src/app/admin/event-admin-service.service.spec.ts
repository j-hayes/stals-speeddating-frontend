import { TestBed } from '@angular/core/testing';

import { EventAdminServiceService } from './event-admin-service.service';

describe('EventAdminServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventAdminServiceService = TestBed.get(EventAdminServiceService);
    expect(service).toBeTruthy();
  });
});
