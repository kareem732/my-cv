import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAboutUsComponent } from './navbar-about-us.component';

describe('NavbarAboutUsComponent', () => {
  let component: NavbarAboutUsComponent;
  let fixture: ComponentFixture<NavbarAboutUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarAboutUsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarAboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
