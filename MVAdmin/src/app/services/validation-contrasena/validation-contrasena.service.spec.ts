import { TestBed } from '@angular/core/testing';

import { ValidationContrasenaService } from './validation-contrasena.service';

describe('ValidationContrasenaService', () => {
  let service: ValidationContrasenaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationContrasenaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
