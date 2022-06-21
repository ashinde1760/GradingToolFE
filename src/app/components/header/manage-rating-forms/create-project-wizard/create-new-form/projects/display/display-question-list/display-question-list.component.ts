import { Component, Input, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { CreateSurveyUtilityService } from 'src/app/services/create-survey/create-survey-utility.service';

@Component({
  selector: 'app-display-question-list',
  templateUrl: './display-question-list.component.html',
  styleUrls: ['./display-question-list.component.css']
})
export class DisplayQuestionListComponent implements OnInit {
  @Input() questionList;
  @Input('sectionIndex') i;
  toggleDisplayIcon = false
  targetSection
  constructor(private util: CreateSurveyUtilityService) { }
  ngOnInit(): void {
    this.targetSection = (this.util.surveyForm.get('surveyData') as FormArray).at(this.i);
  }

}
