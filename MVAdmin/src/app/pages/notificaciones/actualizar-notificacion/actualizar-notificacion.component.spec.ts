import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarNotificacionComponent } from './actualizar-notificacion.component';

describe('ActualizarNotificacionComponent', () => {
  let component: ActualizarNotificacionComponent;
  let fixture: ComponentFixture<ActualizarNotificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActualizarNotificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarNotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
