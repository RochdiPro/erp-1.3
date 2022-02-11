import { TestBed } from '@angular/core/testing';

import { BulletinPaieServiceService } from './bulletin-paie-service.service';

describe('BulletinPaieServiceService', () => {
  let service: BulletinPaieServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BulletinPaieServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
