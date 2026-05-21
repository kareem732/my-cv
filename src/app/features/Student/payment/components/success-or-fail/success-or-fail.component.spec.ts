import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessOrFailComponent } from './success-or-fail.component';

describe('SuccessOrFailComponent', () => {
  let component: SuccessOrFailComponent;
  let fixture: ComponentFixture<SuccessOrFailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessOrFailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessOrFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
