import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceBreakdownComponent } from './price-breakdown.component';

describe('PriceBreakdownComponent', () => {
  let component: PriceBreakdownComponent;
  let fixture: ComponentFixture<PriceBreakdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceBreakdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
