import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { CreateSurveyUtilityService } from "../../../../../../../../services/create-survey/create-survey-utility.service";
@Component({
  selector: 'app-review-options',
  templateUrl: './review-options.component.html',
  styleUrls: ['./review-options.component.css']
})
export class ReviewOptionsComponent implements OnInit,OnChanges {
  surveyForm: FormGroup;

  @Input() optionIdType: string
  constructor(public util: CreateSurveyUtilityService) { }

  updateOption(event: Event, index: string, type: string) {
    const updatedValue = (<HTMLInputElement>(event.target)).value;
    const optionsFormArr = this.surveyForm.get('options') as FormArray;
    const targetOption = optionsFormArr.at(+index);


    switch (type) {
      case 'optionDataChange':
        targetOption.patchValue({
          optionData: updatedValue
        })
        break;

      case 'optionWeightageChange':
        targetOption.patchValue({
          optionweightage: updatedValue
        })
        break;

      case 'optionInputFieldTypeChange':
        targetOption.patchValue({
          inputFieldRequired: updatedValue
        });
        break;

      default:
        break;
    }
  }
  
  ngOnChanges(){

  }
  ngOnInit(): void {
    this.surveyForm = this.util.surveyForm;
  }

}
