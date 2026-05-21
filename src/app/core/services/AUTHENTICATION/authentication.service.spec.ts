import { TestBed } from '@angular/core/testing';

import { AUTHENTICATIONService } from './authentication.service';

describe('AUTHENTICATIONService', () => {
  let service: AUTHENTICATIONService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AUTHENTICATIONService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
