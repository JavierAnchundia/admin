import { TestBed } from '@angular/core/testing';

import { ComunicateNavSiderService } from './comunicate-nav-sider.service';

describe('ComunicateNavSiderService', () => {
  let service: ComunicateNavSiderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComunicateNavSiderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
