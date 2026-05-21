import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyguidyAboutUsComponent } from './whyguidy-about-us.component';

describe('WhyguidyAboutUsComponent', () => {
  let component: WhyguidyAboutUsComponent;
  let fixture: ComponentFixture<WhyguidyAboutUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyguidyAboutUsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyguidyAboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
