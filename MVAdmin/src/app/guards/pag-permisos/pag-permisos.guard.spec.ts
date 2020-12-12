import { TestBed } from '@angular/core/testing';

import { PagPermisosGuard } from './pag-permisos.guard';

describe('PagPermisosGuard', () => {
  let guard: PagPermisosGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PagPermisosGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
