import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonCrearComponent } from './boton-crear.component';

describe('BotonCrearComponent', () => {
  let component: BotonCrearComponent;
  let fixture: ComponentFixture<BotonCrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotonCrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotonCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
