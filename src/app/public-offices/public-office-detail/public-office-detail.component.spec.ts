import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicOfficeDetailComponent } from './public-office-detail.component';

describe('PublicOfficeDetailComponent', () => {
  let component: PublicOfficeDetailComponent;
  let fixture: ComponentFixture<PublicOfficeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicOfficeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicOfficeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
