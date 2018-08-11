import { TestBed, inject } from '@angular/core/testing';

import { PublicOfficeService } from './public-office.service';

describe('PublicOfficeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PublicOfficeService]
    });
  });

  it('should be created', inject([PublicOfficeService], (service: PublicOfficeService) => {
    expect(service).toBeTruthy();
  }));
});
