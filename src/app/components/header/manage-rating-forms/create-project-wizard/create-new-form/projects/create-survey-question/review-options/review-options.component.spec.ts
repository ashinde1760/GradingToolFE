import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewOptionsComponent } from './review-options.component';

describe('ReviewOptionsComponent', () => {
  let component: ReviewOptionsComponent;
  let fixture: ComponentFixture<ReviewOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
