import { TestBed } from '@angular/core/testing';

import { PerfilCementerioGuard } from './perfil-cementerio.guard';

describe('PerfilCementerioGuard', () => {
  let guard: PerfilCementerioGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PerfilCementerioGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
