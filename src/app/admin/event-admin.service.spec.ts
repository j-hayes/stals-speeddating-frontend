import { TestBed } from '@angular/core/testing';

import { EventAdminService } from './event-admin.service';

describe('EventAdminServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventAdminService = TestBed.get(EventAdminService);
    expect(service).toBeTruthy();
  });
});
