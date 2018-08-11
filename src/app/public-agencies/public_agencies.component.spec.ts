import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicAgenciesComponent } from './public_agencies.component';

describe('PublicAgenciesComponent', () => {
  let component: PublicAgenciesComponent;
  let fixture: ComponentFixture<PublicAgenciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicAgenciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicAgenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
