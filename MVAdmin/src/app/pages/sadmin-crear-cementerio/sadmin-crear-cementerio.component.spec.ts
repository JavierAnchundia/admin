import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SadminCrearCementerioComponent } from './sadmin-crear-cementerio.component';

describe('SadminCrearCementerioComponent', () => {
  let component: SadminCrearCementerioComponent;
  let fixture: ComponentFixture<SadminCrearCementerioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SadminCrearCementerioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SadminCrearCementerioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
