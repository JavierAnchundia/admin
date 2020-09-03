import { TestBed } from '@angular/core/testing';

import { CargarCementeriosService } from './cargar-cementerios.service';

describe('CargarCementeriosService', () => {
  let service: CargarCementeriosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargarCementeriosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
