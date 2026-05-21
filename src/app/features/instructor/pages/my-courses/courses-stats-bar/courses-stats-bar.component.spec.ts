import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesStatsBarComponent } from './courses-stats-bar.component';

describe('CoursesStatsBarComponent', () => {
  let component: CoursesStatsBarComponent;
  let fixture: ComponentFixture<CoursesStatsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesStatsBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesStatsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
