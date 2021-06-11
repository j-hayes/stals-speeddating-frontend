import { TestBed } from '@angular/core/testing';

import { EventPrintService } from './event-print.service';

describe('EventPrintService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventPrintService = TestBed.get(EventPrintService);
    expect(service).toBeTruthy();
  });
});
