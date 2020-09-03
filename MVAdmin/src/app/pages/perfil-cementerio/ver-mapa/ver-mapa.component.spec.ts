import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMapaComponent } from './ver-mapa.component';

describe('VerMapaComponent', () => {
  let component: VerMapaComponent;
  let fixture: ComponentFixture<VerMapaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerMapaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerMapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
