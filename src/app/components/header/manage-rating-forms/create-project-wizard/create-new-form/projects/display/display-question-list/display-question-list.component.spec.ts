import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayQuestionListComponent } from './display-question-list.component';

describe('DisplayQuestionListComponent', () => {
  let component: DisplayQuestionListComponent;
  let fixture: ComponentFixture<DisplayQuestionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayQuestionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayQuestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
