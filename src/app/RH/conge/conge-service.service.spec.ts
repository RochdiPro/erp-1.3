import { TestBed } from '@angular/core/testing';

import { CongeServiceService } from './conge-service.service';

describe('CongeServiceService', () => {
  let service: CongeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CongeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
