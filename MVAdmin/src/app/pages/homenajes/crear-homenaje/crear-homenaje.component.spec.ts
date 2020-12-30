import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearHomenajeComponent } from './crear-homenaje.component';

describe('CrearHomenajeComponent', () => {
  let component: CrearHomenajeComponent;
  let fixture: ComponentFixture<CrearHomenajeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearHomenajeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearHomenajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
