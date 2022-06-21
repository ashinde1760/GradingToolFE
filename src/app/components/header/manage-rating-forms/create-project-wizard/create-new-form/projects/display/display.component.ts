import { Component, OnInit, Input, AfterContentInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { CreateSurveyUtilityService } from "../../../../../../../services/create-survey/create-survey-utility.service";
@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css'],

})
export class DisplayComponent {


  constructor(private util: CreateSurveyUtilityService) { }
  sections: any
  notEmpty: boolean = false


  ngOnInit() {

    const surveys = (this.util.surveyForm.get('surveyData') as FormArray);
    
    (surveys.valueChanges.subscribe((val: Array<any>) => {
      this.sections = val
      this.notEmpty = val.length > 0
    }))

    if (surveys.length > 0) {

      this.sections = surveys.value;
      this.notEmpty = true;
      return
    }
  }

}
