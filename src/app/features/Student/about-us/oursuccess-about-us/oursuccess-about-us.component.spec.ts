import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OursuccessAboutUsComponent } from './oursuccess-about-us.component';

describe('OursuccessAboutUsComponent', () => {
  let component: OursuccessAboutUsComponent;
  let fixture: ComponentFixture<OursuccessAboutUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OursuccessAboutUsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OursuccessAboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
