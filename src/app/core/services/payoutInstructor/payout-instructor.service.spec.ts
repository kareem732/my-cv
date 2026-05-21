import { TestBed } from '@angular/core/testing';

import { PayoutInstructorService } from './payout-instructor.service';

describe('PayoutInstructorService', () => {
  let service: PayoutInstructorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayoutInstructorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
