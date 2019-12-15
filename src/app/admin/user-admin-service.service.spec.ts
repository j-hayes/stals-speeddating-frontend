import { TestBed } from '@angular/core/testing';

import { UserAdminServiceService } from './user-admin-service.service';

describe('UserAdminServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserAdminServiceService = TestBed.get(UserAdminServiceService);
    expect(service).toBeTruthy();
  });
});
