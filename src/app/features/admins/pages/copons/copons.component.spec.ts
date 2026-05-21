import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoponsComponent } from './copons.component';

describe('CoponsComponent', () => {
  let component: CoponsComponent;
  let fixture: ComponentFixture<CoponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoponsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
