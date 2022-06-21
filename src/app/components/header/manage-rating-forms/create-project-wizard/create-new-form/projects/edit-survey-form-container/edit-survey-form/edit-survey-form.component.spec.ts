import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSurveyFormComponent } from './edit-survey-form.component';

describe('EditSurveyFormComponent', () => {
  let component: EditSurveyFormComponent;
  let fixture: ComponentFixture<EditSurveyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSurveyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSurveyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
