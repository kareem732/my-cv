import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumStatsComponent } from './curriculum-stats.component';

describe('CurriculumStatsComponent', () => {
  let component: CurriculumStatsComponent;
  let fixture: ComponentFixture<CurriculumStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculumStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
