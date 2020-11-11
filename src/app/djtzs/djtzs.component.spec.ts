import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DjtzsComponent } from './djtzs.component';

describe('DjtzsComponent', () => {
  let component: DjtzsComponent;
  let fixture: ComponentFixture<DjtzsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DjtzsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DjtzsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
