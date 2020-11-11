import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DjspComponent } from './djsp.component';

describe('DjspComponent', () => {
  let component: DjspComponent;
  let fixture: ComponentFixture<DjspComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DjspComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DjspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
