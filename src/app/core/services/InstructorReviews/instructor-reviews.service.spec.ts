import { TestBed } from '@angular/core/testing';

import { InstructorReviewsService } from './instructor-reviews.service';

describe('InstructorReviewsService', () => {
  let service: InstructorReviewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstructorReviewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
