import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilConfiguracionComponent } from './perfil-configuracion.component';

describe('PerfilConfiguracionComponent', () => {
  let component: PerfilConfiguracionComponent;
  let fixture: ComponentFixture<PerfilConfiguracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilConfiguracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
