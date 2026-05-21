import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificCourseStudentComponent } from './specific-course-student.component';

describe('SpecificCourseStudentComponent', () => {
  let component: SpecificCourseStudentComponent;
  let fixture: ComponentFixture<SpecificCourseStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecificCourseStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecificCourseStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
