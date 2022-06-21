import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations'
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { FetchSurveyEnd } from 'src/app/store/actions/survey.actions';
import { Options } from 'src/app/util/FormType';
import { CreateSurveyUtilityService } from '../../../../../../../services/create-survey/create-survey-utility.service';
import { AppState } from "../../../../../../../store";

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.css'],
  animations:[trigger('mediaOption',[
    state('collapsed',style({
      height:0,
      overflow:'hidden'
    })),
    state('expanded',style({
      height:'70px',
      overflow:'auto'
    })),
    transition('collapsed=>expanded',[animate('300ms ease-out')]),
    transition('expanded=>collapsed',[animate('300ms ease-in')])
  ])]
  
})
export class CreateSurveyComponent implements OnInit,OnDestroy {

  index: number;
  surveyId: string
  showOptionCreator: Subject<boolean> = new Subject();
  showOpenEndedResponseTypeBox: Subject<boolean> = new Subject()
  showImageOptions=false;
  showFileOptions=false
  deleteQuestion=false
  editQuestionId;
  targetSection:FormArray;
  targetSectionQuestions;
  questionIndex;
  optionIdType: string = "uppercase alphabet"

  constructor(
    public util: CreateSurveyUtilityService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute) {
  }

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

  changeShowImageOption(){
    this.showImageOptions=!this.showImageOptions
    this.showFileOptions=false
  }
  changeShowFileOption(){
    this.showFileOptions=!this.showFileOptions
    this.showImageOptions=false
  }
  
  dismiss(){
    this.util.editQuestion=false
    this.util.surveyForm.get('question').reset();
    (this.util.surveyForm.get('options') as FormArray).clear();
   
    const control =  (this.util.surveyForm.get('attachmentType') as FormArray);

    for(let i = control.length-1; i >= 0; i--) {
      control.removeAt(i)
    }
    this.util.surveyForm.get('media').reset()
    this.detectQuestionType('Question Type')
    this.util.surveyForm.get('questionType').reset('Question Type')
    this.util.surveyForm.get('docAttachment').setValue('No')
    this.util.surveyForm.get('imageAttachment').setValue('No')
    this.util.surveyForm.get('weightage').reset()
    this.util.surveyForm.get('inputfieldRequried').reset(false)
    this.util.surveyForm.get('isMandatory').reset(false)
    this.util.addFile=false;
    this.util.addImage=false;
    this.util.editTargetSectionQuestion.next(null)
    this.showOptionCreator.next(false)
    this.showOpenEndedResponseTypeBox.next(false)
    this.showFileOptions=false;
    this.showImageOptions=false
  
  }

  saveEdit(){

  }

  ngOnDestroy(){
    this.util.targetSectionIndex.next(null)
    this.util.editTargetSectionQuestion.next(null)
    this.store.dispatch(new FetchSurveyEnd({survey:null}))
  }
  triggerAttachment(ref) {
    (ref as HTMLInputElement).click();
  }

  detectQuestionType(option: string) {
    if(this.util.editQuestion){
       
        this.util.surveyForm.get('weightage').setValue(null);
        
      }
      
      (this.util.surveyForm.get('options') as FormArray).clear();
    (this.util.surveyForm.get('option') as FormGroup).reset()
    if (option === 'Multiple choice' || option === 'Dropdown' || option === 'Check-Box') {
      this.showOptionCreator.next(true)
      this.showOpenEndedResponseTypeBox.next(false);
      if(!this.util.editQuestion){
      (this.util.surveyForm.get('options') as FormArray).push(new FormGroup({
        optionId: new FormControl(this.optionId),
        optionData: new FormControl(null,Validators.required),
        optionweightage: new FormControl(null,Validators.required),
        inputFieldRequired: new FormControl(null),
      }))}
    } else {
      this.showOpenEndedResponseTypeBox.next(true)
      this.showOptionCreator.next(false)
    }

  }
  
  ngOnInit(): void {

    this.util.targetSectionIndex.subscribe(val => {
      this.index = val;
    });

    this.util.editTargetSectionQuestion.subscribe(val=>{
      if(val!==null){
    //     const questionRef = this.util.surveyForm.get('question');
    // const optionsRef = this.util.surveyForm.get('options') as FormArray;
    // const mediaRef = this.util.surveyForm.get('media');

    // const inputFieldRequiredRef = this.util.surveyForm.get('inputfieldRequried');
    
    // const openEndedWeightageRef = this.util.surveyForm.get('weightage');
    // const questionTypeRef = this.util.surveyForm.get('questionType');
    // const isMandatoryRef = this.util.surveyForm.get('isMandatory');
    // const attachmentRequiredRef = this.util.surveyForm.get('attachmentRequired');
    // const attachmentTypeRef = this.util.surveyForm.get('attachmentType');
    //     this.util.addFile=false;
    // this.util.addImage=false
    // questionRef.reset();
    // optionsRef.clear();
    // mediaRef.reset();
    // questionTypeRef.setValue('Question Type');
    // isMandatoryRef.reset();
    // attachmentRequiredRef.reset();
    // (attachmentTypeRef as FormArray).clear();
    // openEndedWeightageRef.reset();
    // inputFieldRequiredRef.reset()
    
    this.index=val.SectionIndex
        const surveyData = this.util.surveyForm.get('surveyData')
         this.targetSection = surveyData.value[val.SectionIndex]
        this.targetSectionQuestions = surveyData.value[val.SectionIndex][2]
       this.questionIndex=val.questionIndex
       const questionObject=this.targetSectionQuestions[val.questionIndex]
       this.util.surveyForm.get('question').setValue(questionObject.question)
       this.editQuestionId=questionObject.questionId
       this.util.surveyForm.get('questionType').setValue(questionObject.questionType)
       this.util.editQuestion=true
       this.detectQuestionType(questionObject.questionType)
       if(questionObject.options.length>0){
        questionObject.options.forEach(
          val=>{

            (<FormArray>(this.util.surveyForm.get('options'))).push(
              new FormGroup({
                optionId: new FormControl(val.optionId),
                optionData: new FormControl(val.optionData,Validators.required),
                optionweightage: new FormControl(val.optionweightage,Validators.required),
                inputFieldRequired: new FormControl(val.inputFieldRequired),
              }))
           }
            )
          }
      //  this.util.surveyForm.get('options').setValue(questionObject.options)
      // this.util.surveyForm.get('questionId').setValue(questionObject.questionId)
       this.util.surveyForm.get('media').setValue(questionObject.media)
      
       this.util.surveyForm.get('docAttachment').setValue(questionObject.docAttachment)
       this.util.surveyForm.get('imageAttachment').setValue(questionObject.imageAttachment)
      
      
         if(questionObject.imageAttachment!=='No'?true:false){
           this.util.addImage=true;
           (this.util.surveyForm.get('attachmentType') as FormArray).push(new FormControl({
             value:'Image'
           }))
          }
          
          if(questionObject.docAttachment!=='No'?true:false){
            this.util.addFile=true;
            (this.util.surveyForm.get('attachmentType') as FormArray).push(new FormControl({
              value:'Document'
            }))
         }
       
       this.util.surveyForm.get('weightage').setValue(questionObject.weightage)
       this.util.surveyForm.get('inputfieldRequried').setValue(questionObject.inputFieldType)
       this.util.surveyForm.get('isMandatory').setValue(questionObject.isMandatory);
      }
    })

  }

  addNewQuestion() {
    let maxMarks:number=0;
    let targetSection: FormArray;

    const allSectionsArr = ((this.util.surveyForm.get('surveyData')) as FormArray);

    targetSection = allSectionsArr.at(this.index) as FormArray;
    
    let questionId: string | number = (targetSection.value[2] as FormArray).length + 1
    questionId = this.util.zeroPadding(questionId, true); // formatting question id , eg : 001, 023
    const questionRef = this.util.surveyForm.get('question');
    const optionsRef = this.util.surveyForm.get('options') as FormArray;
    const mediaRef = this.util.surveyForm.get('media');

    const inputFieldRequiredRef = this.util.surveyForm.get('inputfieldRequried');
    
    const openEndedWeightageRef = this.util.surveyForm.get('weightage');
    const questionTypeRef = this.util.surveyForm.get('questionType');
    const isMandatoryRef = this.util.surveyForm.get('isMandatory');
    const imageAttachmentRef=this.util.surveyForm.get('imageAttachment')
    const docAttachmentRef=this.util.surveyForm.get('docAttachment')
    const attachmentTypeRef = this.util.surveyForm.get('attachmentType') as FormArray;

    const QuestionFormGroup = new FormGroup({});

    const questionObj = {

      questionId:this.util.editQuestion? this.editQuestionId:questionId,
      question: questionRef.value,
      options: optionsRef.value,
      media: mediaRef.value,

      weightage: openEndedWeightageRef.value,

      questionType: questionTypeRef.value,
      isMandatory: isMandatoryRef.value,

      inputFieldRequired: inputFieldRequiredRef.value ? 'Yes' : 'No',
      inputFieldType: inputFieldRequiredRef.value ? inputFieldRequiredRef.value : '',


      docAttachment:docAttachmentRef.value,
      imageAttachment:imageAttachmentRef.value,
      

    };

    for (const key in questionObj) {

      const element = questionObj[key];
      QuestionFormGroup.addControl(key, new FormControl(element));
    }

      if(!this.util.editQuestion){
        const maxSectionMark = this.calculateMaxMark(optionsRef.value,
          ((targetSection.at(1)) as FormControl).value,
          openEndedWeightageRef.value);
        ((targetSection.at(2)) as FormArray).push(QuestionFormGroup);
        ((targetSection.at(1)) as FormControl).setValue(maxSectionMark);
      }else{
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
         const maxSectionMark = this.calculateMaxMark(optionsRef.value,
      ((targetSection.at(1)) as FormControl).value,
      openEndedWeightageRef.value,true,maxMarks);
        ((targetSection.at(2)) as FormArray).setControl(this.questionIndex,QuestionFormGroup);
        ((targetSection.at(1)) as FormControl).setValue(maxSectionMark);
      }


    this.updateFormMark(allSectionsArr);
    this.util.addFile=false;
    this.util.addImage=false
    questionRef.reset();
    optionsRef.clear();
    mediaRef.reset();
    questionTypeRef.setValue('Question Type');
    isMandatoryRef.reset();
    imageAttachmentRef.setValue('No')
    docAttachmentRef.setValue('No')
    attachmentTypeRef.clear();
    openEndedWeightageRef.reset();
    inputFieldRequiredRef.reset()
    this.showOptionCreator.next(false);
    this.showOpenEndedResponseTypeBox.next(false);
    this.util.editQuestion=false
    this.showFileOptions=false
    this.showImageOptions=false

  }
 
  acceptAttachment(attachmentType: string): void {
    // const reader = new FileReader();
    let attachmentTypeRef = this.util.surveyForm.get('attachmentType') as FormArray;
    let imageAttachmentRef=this.util.surveyForm.get('imageAttachment')
    let docAttachmentRef=this.util.surveyForm.get('docAttachment')
    if(attachmentType=='Image'&&this.util.addImage==false){
      this.util.addImage=true
      this.showImageOptions=true
      this.showFileOptions=false
      attachmentTypeRef.push(
        new FormControl(
        {
        value: attachmentType,
        })
      )
      imageAttachmentRef.setValue('Optional')
    }
    else if(attachmentType=='Image'&&this.util.addImage){
      this.util.addImage=false
      this.showImageOptions=false
      let index= (attachmentTypeRef as FormArray).value.findIndex(value=>{
        return value.value=='Image'
      })
      attachmentTypeRef.removeAt(index)
      imageAttachmentRef.setValue('No')
    }
    else if(attachmentType=='Document'&&!this.util.addFile){
      this.util.addFile=true
      this.showFileOptions=true
      this.showImageOptions=false
      attachmentTypeRef.push(
        new FormControl(
          {
            value: attachmentType
          })
          )
        docAttachmentRef.setValue('Optional')  
        }else if(attachmentType=='Document'&&this.util.addFile){
          this.util.addFile=false
          this.showFileOptions=false
      let index= (attachmentTypeRef as FormArray).value.findIndex(value=>{
        return value.value=='Document'
      })
      attachmentTypeRef.removeAt(index)
      docAttachmentRef.setValue('No')
    }

    }
    // if (value.files && value.files.length) {
    
    // reader.readAsDataURL(value.files[0]);
    
    
    // reader.onload = () => {
    // const formData = new FormData()
    // formData.append('', reader.result as string)
    
    
  
    // };
    // }
    


  updateFormMark(sectionsFormArr: FormArray): void {
    const sectionValues: Array<number> = sectionsFormArr.value;
    let max = 0;
    sectionValues.forEach(el => {
      max += el[1];
    });
    this.util.surveyForm.get('formTotalMark').setValue(max);
  }

  calculateMaxMark(options: Options[], prevMax: number, openEndedWeightage?: number,edit?:boolean,maxMarks?): number {

    let max = 0;
    if(this.util.surveyForm.get('questionType').value!=='Check-Box'){
      options.forEach(option => {
        max = +option.optionweightage > max ? +option.optionweightage : max;
      });
    }
    else{
      options.forEach(option => {
        max +=option.optionweightage
      });
    }

if(edit){
  return openEndedWeightage ? openEndedWeightage + prevMax-maxMarks + max : prevMax-maxMarks + max;
}else{
  return openEndedWeightage ? openEndedWeightage + prevMax + max : prevMax + max;

}

  }

}
