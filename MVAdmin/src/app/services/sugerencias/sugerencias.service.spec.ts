import { TestBed } from '@angular/core/testing';

import { SugerenciasService } from './sugerencias.service';

describe('SugerenciasService', () => {
  let service: SugerenciasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SugerenciasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
