import { TestBed } from '@angular/core/testing';

import { PaquetesService } from './paquetes.service';

describe('PaquetesService', () => {
  let service: PaquetesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaquetesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
