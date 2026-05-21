import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactusAboutUsComponent } from './contactus-about-us.component';

describe('ContactusAboutUsComponent', () => {
  let component: ContactusAboutUsComponent;
  let fixture: ComponentFixture<ContactusAboutUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactusAboutUsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactusAboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
