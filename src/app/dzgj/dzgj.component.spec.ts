import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DzgjComponent } from './dzgj.component';

describe('DzgjComponent', () => {
  let component: DzgjComponent;
  let fixture: ComponentFixture<DzgjComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DzgjComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DzgjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
