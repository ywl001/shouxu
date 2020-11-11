import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CxspComponent } from './cxsp.component';

describe('CxspComponent', () => {
  let component: CxspComponent;
  let fixture: ComponentFixture<CxspComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CxspComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CxspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
