import { TestBed } from '@angular/core/testing';

import { WishlistStateService } from './wishlist-state.service';

describe('WishlistStateService', () => {
  let service: WishlistStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WishlistStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
