import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Options } from 'src/app/util/FormType';
import { CreateSurveyUtilityService } from "../../../../../../../../services/create-survey/create-survey-utility.service";
@Component({
  selector: 'app-delete-option',
  templateUrl: './delete-option.component.html',
  styleUrls: ['./delete-option.component.css']
})
export class DeleteOptionComponent implements OnInit {
  @Input('index') i: string;
  @Input('optionRef') option: any;
  surveyForm: FormGroup;
  @Input() optionIdType: string
  constructor(private util: CreateSurveyUtilityService) { }

  deleteOption(index: string) {
    const optionsRef = this.util.surveyForm.get('options') as FormArray
    optionsRef.removeAt(+index);

    (optionsRef.value as Array<Options>).forEach((_, index) => {
      const targetOption = optionsRef.at(index);
      // const targetOptionValue: Options = targetOption.value
      targetOption.patchValue({
        optionId: this.util.generateOptionId(index, this.optionIdType),
      })
    })

  }
  ngOnInit(): void {
    
  }

}
