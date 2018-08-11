import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicAgencyDetailComponent } from './public-agency-detail.component';

describe('PublicOfficeDetailComponent', () => {
  let component: PublicAgencyDetailComponent;
  let fixture: ComponentFixture<PublicAgencyDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicAgencyDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicAgencyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
