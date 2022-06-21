import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateSurveyUtilityService {
  editQuestion=false
  surveyForm: FormGroup;
  targetSectionIndex: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  sectionNameValid: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  editTargetSectionQuestion:BehaviorSubject<{SectionIndex:number,questionIndex:number}>=new BehaviorSubject<{SectionIndex:number,questionIndex:number}>(null);
  // DeleteTargetSectionQuestion:BehaviorSubject<{SectionIndex:number,questionIndex:number}>=new BehaviorSubject<{SectionIndex:number,questionIndex:number}>(null);
  attachmentTypes = [
    'Pdf Document',
    'Jpeg Image',
    'Zip Archive'
  ];
  addImage:boolean=false
  addFile:boolean=false
  optionInputFieldTypes = [
    'Not Required',
    'Number',
    'Text',
    'Date',
    'Duration',
    'Media'
  ];
  romanMap = {
    1: 'i',
    2: 'ii',
    3: 'iii',
    4: 'iv',
    5: 'v',
    6: 'vi',
    7: 'vii',
    8: 'viii',
    9: 'ix',
    10: 'x',
  };


  getDateTime() {

    const date = this.zeroPadding(new Date().getDate())
    const month = this.zeroPadding(new Date().getMonth() + 1)
    const year = new Date().getFullYear()
    const hh = this.zeroPadding(new Date().getHours())
    const mm = this.zeroPadding(new Date().getMinutes())
    const ss = this.zeroPadding(new Date().getSeconds())
    return `${date}-${month}-${year} ${hh}:${mm}:${ss}`
  }

  

  zeroPadding(value: number, custom: boolean = false) {

    if (custom) {
      if (value < 10) {
        return "00" + value;
      } else if (value >= 10 && value <= 99) {
        return '0' + value
      } else {
        return value
      }
    } else {
      if (value < 10) {
        return "0" + value;
      } else {
        return value
      }
    }


  }

  generateOptionId(number: number, optionIdType: string): string {
    number = number.toString().charCodeAt(0);
    switch (optionIdType) {
      case 'uppercase alphabet':
        return String.fromCharCode(Number(number) + 17);
      case 'lowercase alphabet':
        return String.fromCharCode(Number(number) + 17).toLowerCase();
      case 'lowercase roman':
        return this.romanMap[String.fromCharCode(number + 1)];
      case 'uppercase roman':
        return this.romanMap[String.fromCharCode(number + 1)].toUpperCase();
      case 'numeric':
        // return number + 1 + ""
        return String.fromCharCode(Number(number + 1));
    }
  }
  

  createSurveyForm(): void {
    this.surveyForm = new FormGroup(
      {
        formName: new FormControl(),
        formTotalMark: new FormControl({ value: 0, disabled: true }),
        surveyData: new FormArray([]), // to hold the sections

        // questionId: new FormControl(),

        question: new FormControl('',Validators.required),
        options: new FormArray([]),
        media: new FormArray([]),

        questionType: new FormControl('Question Type'),
        isMandatory: new FormControl(false),
        imageAttachment: new FormControl('No'),
        docAttachment:new FormControl('No'),
        attachmentType: new FormArray([]),
        weightage: new FormControl(null,Validators.required),

        inputfieldRequried: new FormControl(false),
        //---structure of new option-----
        option: new FormGroup({
          optionData: new FormControl('',Validators.required),
          optionweightage: new FormControl(null,Validators.required),
          inputFieldRequired: new FormControl('Not Required'),
        })
      }
    );
  }
}
