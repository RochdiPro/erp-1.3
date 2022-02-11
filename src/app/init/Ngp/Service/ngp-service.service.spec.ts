import { TestBed } from '@angular/core/testing';

import { NgpServiceService } from './ngp-service.service';

describe('NgpServiceService', () => {
  let service: NgpServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgpServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
