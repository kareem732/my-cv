import { ComponentFixture, TestBed } from '@angular/core/testing';

import { COURSECARTComponent } from './course-cart.component';

describe('COURSECARTComponent', () => {
  let component: COURSECARTComponent;
  let fixture: ComponentFixture<COURSECARTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [COURSECARTComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(COURSECARTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
