import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DqzjComponent } from './dqzj.component';

describe('DqzjComponent', () => {
  let component: DqzjComponent;
  let fixture: ComponentFixture<DqzjComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DqzjComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DqzjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
