import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilCementerioComponent } from './perfil-cementerio.component';

describe('PerfilCementerioComponent', () => {
  let component: PerfilCementerioComponent;
  let fixture: ComponentFixture<PerfilCementerioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilCementerioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilCementerioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
