import { TestBed } from '@angular/core/testing';

import { BonEntreeImportationServiceService } from './bon-entree-importation-service.service';

describe('BonEntreeImportationServiceService', () => {
  let service: BonEntreeImportationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonEntreeImportationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
