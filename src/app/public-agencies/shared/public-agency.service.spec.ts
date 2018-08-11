import { TestBed, inject } from '@angular/core/testing';

import { PublicAgencyService } from './public-agency.service';

describe('PublicAgencyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PublicAgencyService]
    });
  });

  it('should be created', inject([PublicAgencyService], (service: PublicAgencyService) => {
    expect(service).toBeTruthy();
  }));
});
