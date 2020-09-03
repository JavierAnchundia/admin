import { TestBed } from '@angular/core/testing';

import { RedsocialService } from './redsocial.service';

describe('RedsocialService', () => {
  let service: RedsocialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RedsocialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
