import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreProgramsComponent } from './explore-programs.component';

describe('ExploreProgramsComponent', () => {
  let component: ExploreProgramsComponent;
  let fixture: ComponentFixture<ExploreProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreProgramsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
