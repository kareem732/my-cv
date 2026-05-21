import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecCourseComponent } from './spec-course.component';

describe('SpecCourseComponent', () => {
  let component: SpecCourseComponent;
  let fixture: ComponentFixture<SpecCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
