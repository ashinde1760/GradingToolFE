import { Component, Input, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { CreateSurveyUtilityService } from "../../../../../../../../services/create-survey/create-survey-utility.service";
@Component({
  selector: 'app-edit-survey-form',
  templateUrl: './edit-survey-form.component.html',
  styleUrls: ['./edit-survey-form.component.css']
})
export class EditSurveyFormComponent implements OnInit {
  // @Input() sectionIndex
  // @Input() questionIndex
  @Input() targetQuestion
  sections: FormArray
  constructor(private util: CreateSurveyUtilityService) { }

  ngOnInit(): void {
    this.sections = this.util.surveyForm.get('surveyData') as FormArray
  }

}
