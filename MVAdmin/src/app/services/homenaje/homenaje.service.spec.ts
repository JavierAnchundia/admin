import { TestBed } from '@angular/core/testing';

import { HomenajeService } from './homenaje.service';

describe('HomenajeService', () => {
  let service: HomenajeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomenajeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
