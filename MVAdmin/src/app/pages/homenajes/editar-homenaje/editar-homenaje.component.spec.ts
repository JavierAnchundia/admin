import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarHomenajeComponent } from './editar-homenaje.component';

describe('EditarHomenajeComponent', () => {
  let component: EditarHomenajeComponent;
  let fixture: ComponentFixture<EditarHomenajeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarHomenajeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarHomenajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
