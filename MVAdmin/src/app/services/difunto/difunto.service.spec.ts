import { TestBed } from '@angular/core/testing';

import { DifuntoService } from './difunto.service';

describe('DifuntoService', () => {
  let service: DifuntoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DifuntoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
