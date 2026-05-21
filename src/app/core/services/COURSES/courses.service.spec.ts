import { TestBed } from '@angular/core/testing';

import { COURSESService } from './courses.service';

describe('COURSESService', () => {
  let service: COURSESService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(COURSESService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
