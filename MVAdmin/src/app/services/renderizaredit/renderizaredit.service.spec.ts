import { TestBed } from '@angular/core/testing';

import { RenderizareditService } from './renderizaredit.service';

describe('RenderizareditService', () => {
  let service: RenderizareditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenderizareditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
