import { TestBed } from '@angular/core/testing';

import { ExporterImporterDonneesService } from './exporter-importer-donnees.service';

describe('ExporterImporterDonneesService', () => {
  let service: ExporterImporterDonneesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExporterImporterDonneesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
