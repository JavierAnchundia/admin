import { TestBed } from '@angular/core/testing';

import { CamposantoService } from './camposanto.service';

describe('CamposantoService', () => {
  let service: CamposantoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CamposantoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
