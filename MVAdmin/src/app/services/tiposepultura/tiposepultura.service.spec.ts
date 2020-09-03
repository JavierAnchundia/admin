import { TestBed } from '@angular/core/testing';

import { TiposepulturaService } from './tiposepultura.service';

describe('TiposepulturaService', () => {
  let service: TiposepulturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposepulturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
