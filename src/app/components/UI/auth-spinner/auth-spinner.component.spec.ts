import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSpinnerComponent } from './auth-spinner.component';

describe('AuthSpinnerComponent', () => {
  let component: AuthSpinnerComponent;
  let fixture: ComponentFixture<AuthSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
