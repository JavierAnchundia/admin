import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroDifuntoComponent } from './registro-difunto.component';

describe('RegistroDifuntoComponent', () => {
  let component: RegistroDifuntoComponent;
  let fixture: ComponentFixture<RegistroDifuntoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroDifuntoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroDifuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
