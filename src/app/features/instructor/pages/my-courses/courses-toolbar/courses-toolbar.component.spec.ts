import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesToolbarComponent } from './courses-toolbar.component';

describe('CoursesToolbarComponent', () => {
  let component: CoursesToolbarComponent;
  let fixture: ComponentFixture<CoursesToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
