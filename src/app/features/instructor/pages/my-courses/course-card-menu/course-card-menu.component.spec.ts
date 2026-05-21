import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCardMenuComponent } from './course-card-menu.component';

describe('CourseCardMenuComponent', () => {
  let component: CourseCardMenuComponent;
  let fixture: ComponentFixture<CourseCardMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCardMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseCardMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
