import { AfterContentInit, Component, Input, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateSurveyUtilityService } from '../../../../../../../services/create-survey/create-survey-utility.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-create-survey-question',
  templateUrl: './create-survey-question.component.html',
  styleUrls: ['./create-survey-question.component.css']
})
export class CreateSurveyQuestionComponent implements OnInit {

  @Input() showOptionCreator: Observable<boolean>;
  @Input() showOpenEndedResponseTypeBox: Observable<boolean>;
  @Input() sectionIndex;
  @Output() questionTypeChange: EventEmitter<string> = new EventEmitter<string>();
  // showAttchmentBox: boolean = false
  // showDependentQuestionBox: boolean = false;

  optionIdType: string = "uppercase alphabet";
  questionNumber: number;

  openEndedQuestionResponseTypes = this.util.optionInputFieldTypes.slice(
    1, this.util.optionInputFieldTypes.length)

  constructor(public util: CreateSurveyUtilityService) { }
  public get optionId() {
    const optionsFormArr = this.util.surveyForm.get('options') as FormArray;
    let length: number;
    if (optionsFormArr.length >= 10) {
      length = 9
    } else {
      length = optionsFormArr.length
    }

    const generatedOptionId = this.util.generateOptionId(length, this.optionIdType);
    return generatedOptionId;
  }


  ngOnInit() {
    
    (<FormArray>(this.util.surveyForm.get('surveyData'))).valueChanges.subscribe(data => {
      this.questionNumber = data.length + 1
    })


    this.questionNumber = (<FormArray>(this.util.surveyForm.get('surveyData'))).length + 1;
  }

  // acceptAttachment(attachmentType: string): void {
  //   // const reader = new FileReader();
  //   const attachmentTypeRef = this.util.surveyForm.get('attachmentType') as FormArray;
    
    
  //   // if (value.files && value.files.length) {
    
  //   // reader.readAsDataURL(value.files[0]);
    
  //   // reader.onload = () => {
  //   // const formData = new FormData()
  //   // formData.append('', reader.result as string)
    
  //   attachmentTypeRef.push(
  //   new FormControl(
  //   {
  //   value: attachmentType
  //   })
  //   );
  //   // };
  //   // }
  //   }

  detectOptionIdStyle(event: Event) {
    this.optionIdType = (<HTMLInputElement>(event.target)).value;
    // ((event.target) as HTMLInputElement).disabled = true
  }
  detectQuestionType(event: Event) {
    const option = (<HTMLInputElement>(event.target)).value;
    this.questionTypeChange.emit(option)

  }

  // toggleShowAttchmentBox(event: Event) {
  //   this.showAttchmentBox = (<HTMLInputElement>(event.target)).checked;
  // }
  // toggleDependentQuestionBox(event: Event) {
  //   this.showDependentQuestionBox = (<HTMLInputElement>(event.target)).checked
  // }
  addNewOption() {
    // const optionId = this.surveyForm.get('option.optionId').value;
    // const optionId = this.optionId;
    // const optionData = this.util.surveyForm.get('option.optionData').value;
    // const optionWeightage = this.util.surveyForm.get('option.optionweightage').value;
    // const inputFieldRequired = this.util.surveyForm.get('option.inputFieldRequired').value;


    (<FormArray>(this.util.surveyForm.get('options'))).push(
      new FormGroup({
        optionId: new FormControl(this.optionId),
        optionData: new FormControl(null,Validators.required),
        optionweightage: new FormControl(null,Validators.required),
        inputFieldRequired: new FormControl(null),
      })

    )

    // this.util.surveyForm.get('option').reset()
  }

}
