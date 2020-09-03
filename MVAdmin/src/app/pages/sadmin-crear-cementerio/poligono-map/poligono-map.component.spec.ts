import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoligonoMapComponent } from './poligono-map.component';

describe('PoligonoMapComponent', () => {
  let component: PoligonoMapComponent;
  let fixture: ComponentFixture<PoligonoMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoligonoMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoligonoMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
