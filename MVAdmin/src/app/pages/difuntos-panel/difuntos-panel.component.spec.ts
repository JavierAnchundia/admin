import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DifuntosPanelComponent } from './difuntos-panel.component';

describe('DifuntosPanelComponent', () => {
  let component: DifuntosPanelComponent;
  let fixture: ComponentFixture<DifuntosPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DifuntosPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DifuntosPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
