import { TestBed } from '@angular/core/testing';

import { PayoutAdminService } from './payout-admin.service';

describe('PayoutAdminService', () => {
  let service: PayoutAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayoutAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
