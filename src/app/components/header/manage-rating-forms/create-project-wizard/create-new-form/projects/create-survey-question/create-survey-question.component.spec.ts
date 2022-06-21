import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSurveyQuestionComponent } from './create-survey-question.component';

describe('CreateSurveyQuestionComponent', () => {
  let component: CreateSurveyQuestionComponent;
  let fixture: ComponentFixture<CreateSurveyQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSurveyQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSurveyQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
