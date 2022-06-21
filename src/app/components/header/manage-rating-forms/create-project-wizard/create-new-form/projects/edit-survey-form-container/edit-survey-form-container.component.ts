import { Component, Input, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { CreateSurveyUtilityService } from 'src/app/services/create-survey/create-survey-utility.service';

@Component({
  selector: 'app-edit-survey-form-container',
  templateUrl: './edit-survey-form-container.component.html',
  styleUrls: ['./edit-survey-form-container.component.css']
})
export class EditSurveyFormContainerComponent implements OnInit {

  @Input() sectionIndex
  @Input() questionIndex
  targetQuestion: any;
  constructor(public util: CreateSurveyUtilityService) { }
  setTargetQuestion(sectionIndex, questionIndex) {
    this.util.editTargetSectionQuestion.next({SectionIndex:sectionIndex,questionIndex:questionIndex})
  }

  deleteTargetQuestion(sectionIndex,questionIndex){
    // this.util.DeleteTargetSectionQuestion.next({sectionIndex:sectionIndex,questionIndex:questionIndex})
    this.util.targetSectionIndex.next(sectionIndex)
   
    let maxMarks:number=0;
    let targetSection: FormArray;
    const allSectionsArr = ((this.util.surveyForm.get('surveyData')) as FormArray);

    targetSection = allSectionsArr.at(+sectionIndex) as FormArray;

    if(((targetSection.at(2)) as FormArray).value[this.questionIndex].weightage==null&&((targetSection.at(2)) as FormArray).value[this.questionIndex].questionType!=='Check-Box'){
      let m=0;
      ((targetSection.at(2)) as FormArray).value[this.questionIndex].options.forEach(
        (option)=>{
          m=+option.optionweightage>m?+option.optionweightage:m
        }
      )
      maxMarks=m
    }
    else if(((targetSection.at(2)) as FormArray).value[this.questionIndex].weightage==null&&((targetSection.at(2)) as FormArray).value[this.questionIndex].questionType=='Check-Box'){
        let m=0;
        ((targetSection.at(2)) as FormArray).value[this.questionIndex].options.forEach(
          (option)=>{
            m+=option.optionweightage
          }
        )
        maxMarks=m
    }else{
      maxMarks=+((targetSection.at(2)) as FormArray).value[this.questionIndex].weightage
    }
      let prevMarks=targetSection.at(1).value;
      targetSection.at(1).setValue(+prevMarks-maxMarks);
      ((targetSection.at(2)) as FormArray).removeAt(+questionIndex);
      ((targetSection.at(2)) as FormArray)['controls'].forEach((question,index)=>{
        question.patchValue({
          questionId:this.util.zeroPadding(index + 1, true)
        })
      })
      this.updateFormMark(allSectionsArr)
  }

  updateFormMark(sectionsFormArr: FormArray): void {
    const sectionValues: Array<number> = sectionsFormArr.value;

    let max = 0;
    sectionValues.forEach(el => {
      max += el[1];
    });
    this.util.surveyForm.get('formTotalMark').setValue(max);
  }

  ngOnInit(): void {

  }

}
