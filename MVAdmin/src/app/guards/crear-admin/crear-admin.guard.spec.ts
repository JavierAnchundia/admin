import { TestBed } from '@angular/core/testing';

import { CrearAdminGuard } from './crear-admin.guard';

describe('CrearAdminGuard', () => {
  let guard: CrearAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CrearAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
