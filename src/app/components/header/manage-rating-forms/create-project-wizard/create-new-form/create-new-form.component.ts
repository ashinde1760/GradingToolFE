import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { CreateSurveyUtilityService } from 'src/app/services/create-survey/create-survey-utility.service';
import { AppState } from 'src/app/store';
import { IndividualSurveyType } from 'src/app/store/effects/survey.effects';
import { selectedFormData } from 'src/app/store/selectors/form.selectors';
import { fetchSurveyId, getAllProjects, getSelectedProject } from 'src/app/store/selectors/projects.selectors';
import { getAllSurveys, getSurveyById } from 'src/app/store/selectors/survey.selectors';

@Component({
  selector: 'app-create-new-form',
  templateUrl: './create-new-form.component.html',
  styleUrls: ['./create-new-form.component.css']
})
export class CreateNewFormComponent implements OnInit,OnDestroy {
  selectedFormName:string;
  targetSurvey$: Observable<IndividualSurveyType>
  projectIndex: any;
  targetedSectionIndex:number
  sectionRef:FormControl
  constructor(
    public util: CreateSurveyUtilityService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private toaster:ToastrService) {}


  addNewSection(): void {
    // this will create a nested array inside surveyData formArray (serves as section), which will contain all our questions
    const surveys = (this.util.surveyForm.get('surveyData') as FormArray);
    if(surveys.length==0||surveys.length>0&&((surveys.at(surveys.length-1) as FormArray).at(2) as FormArray).length!==0){
      surveys.push(new FormArray([
        new FormControl(`Section ${surveys.length + 1}`),
     new FormControl(0),
        new FormArray([]),
        new FormControl(`Section ${surveys.length + 1}`,Validators.required)
      ]));
  
      this.util.targetSectionIndex.next(surveys.length - 1);
    }else{
       this.toaster.warning('No question added in the current section','Cannot Add Section')
    }

  }

  ngOnDestroy(){
    (this.util.surveyForm.get('surveyData') as FormArray).clear()
    this.util.surveyForm.get('question').reset();
    (this.util.surveyForm.get('options') as FormArray).clear();
    (this.util.surveyForm.get('attachmentType') as FormArray).clear();
    (this.util.surveyForm.get('media') as FormArray).clear();
    this.util.surveyForm.get('questionType').reset('Question Type');
    this.util.surveyForm.get('docAttachment').setValue('No')
    this.util.surveyForm.get('imageAttachment').setValue('No')
    this.util.surveyForm.get('isMandatory').reset(false)
    this.util.surveyForm.get('weightage').reset()
    this.util.addFile=false
    this.util.addImage=false
    this.util.editQuestion=false
    this.util.sectionNameValid.next(true)
  }

  targetSectionChange(event: Event): void {
    const val = +((event.target) as HTMLInputElement).value;
    this.util.targetSectionIndex.next(val);
  }


  ngOnInit(): void {
    this.store.pipe(select(selectedFormData)).subscribe(form=>{
      if(form){
        this.selectedFormName= form.formName
      }else{
        this.router.navigate(['manage-rating-forms/edit-project-wizard'])
      }
     
    })
    this.util.targetSectionIndex.subscribe(val=>{
      this.targetedSectionIndex=val
    })
    this.util.createSurveyForm();

    this.targetSurvey$=this.store.pipe(select(getAllSurveys))
    this.populateSurveyForm()

  }

  
  changeSectionName(event:Event,input){
   this.sectionRef=(((this.util.surveyForm.get('surveyData') as FormArray).at(this.targetedSectionIndex) as FormArray).at(3) as FormControl);
    
    ((this.util.surveyForm.get('surveyData') as FormArray).at(this.targetedSectionIndex) as FormArray).at(3).setValue((event.target as HTMLInputElement).value)
   this.util.sectionNameValid.next(this.sectionRef.valid)
  }
  

  populateSurveyForm() {

    const surveyData = (this.util.surveyForm.get('surveyData') as FormArray);
    const formNameRef = this.util.surveyForm.get('formName')
    const formTotalMarkRef = this.util.surveyForm.get('formTotalMark')


    this.targetSurvey$
      .subscribe((survey: IndividualSurveyType) => {
        if(survey!==null){
  
          formNameRef.setValue(survey.formName)
          formTotalMarkRef.setValue(survey.maxScore)
  
          if (survey.surveyData.sections?(survey.surveyData.sections.length!==0?true:false):false) {
            //emit initial section index only if section is present
            this.util.targetSectionIndex.next(survey.surveyData.sections.length - 1)
  
            //populate survey data form array only if section(s) are present
            survey.surveyData.sections.forEach(section => {
              const sectionName = section.sectionName?section.sectionName:section.sectionId;
              const sectionMark = section.sectionScore
              const sectionId=section.sectionId
  
              const sectionQuestions = section.sectionQuestions
  
  
              let tempSection = new FormArray(
                [
                  new FormControl(),
                  new FormControl(),
                  new FormArray([]),
                  new FormControl('',Validators.required)
                ]
              )
              sectionQuestions.forEach(question => {
  
                let QuestionFormGroup: FormGroup = new FormGroup({});
                const questionObj = {
                  questionId: question.questionId,
                  question: question.questionData.question,
                  options: question.questionData.options,
                  media: question.questionData.media,
  
                  weightage: question.questionData.weightage,
  
                  questionType: question.questionMetaData.questionType,
                  isMandatory: question.questionMetaData.isMandatory,
  
                  docAttachment: question.questionMetaData.attachment.docAttachment,
                  imageAttachment: question.questionMetaData.attachment.imageAttachment,
  
  
                  inputFieldType: question.optionsMetaData.inputField.type,
                  inputFieldRequired: question.optionsMetaData.inputField.inputFieldRequired,
  
                };
  
                for (const key in questionObj) {
  
                  const element = questionObj[key];
                    
                  QuestionFormGroup.addControl(key, new FormControl(element));
                }
                (tempSection.at(2) as FormArray).push(QuestionFormGroup)
  
              })
  
              tempSection.at(0).setValue(sectionId)
              tempSection.at(1).setValue(sectionMark)

              tempSection.at(3).setValue(sectionName)
  
              surveyData.push(tempSection)
  
            })
          }
        }





      })
  }



}





