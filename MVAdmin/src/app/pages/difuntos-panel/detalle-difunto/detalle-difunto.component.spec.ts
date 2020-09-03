import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleDifuntoComponent } from './detalle-difunto.component';

describe('DetalleDifuntoComponent', () => {
  let component: DetalleDifuntoComponent;
  let fixture: ComponentFixture<DetalleDifuntoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleDifuntoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleDifuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
