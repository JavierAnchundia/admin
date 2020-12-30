import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomenajesComponent } from './homenajes.component';

describe('HomenajesComponent', () => {
  let component: HomenajesComponent;
  let fixture: ComponentFixture<HomenajesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomenajesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomenajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
