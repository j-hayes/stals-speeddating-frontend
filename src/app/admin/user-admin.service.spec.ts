import { TestBed } from '@angular/core/testing';

import { UserAdminService } from './user-admin.service';

describe('UserAdminServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserAdminService = TestBed.get(UserAdminService);
    expect(service).toBeTruthy();
  });
});
