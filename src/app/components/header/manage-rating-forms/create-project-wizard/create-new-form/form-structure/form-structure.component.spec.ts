import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStructureComponent } from './form-structure.component';

describe('FormStructureComponent', () => {
  let component: FormStructureComponent;
  let fixture: ComponentFixture<FormStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
