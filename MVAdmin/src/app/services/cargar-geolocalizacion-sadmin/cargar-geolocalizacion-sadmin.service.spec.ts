import { TestBed } from '@angular/core/testing';

import { CargarGeolocalizacionSadminService } from './cargar-geolocalizacion-sadmin.service';

describe('CargarGeolocalizacionSadminService', () => {
  let service: CargarGeolocalizacionSadminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargarGeolocalizacionSadminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
