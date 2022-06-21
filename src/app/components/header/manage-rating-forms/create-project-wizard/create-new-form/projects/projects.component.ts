import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AppState } from 'src/app/store';
import { CreateSurveyStart } from 'src/app/store/actions/survey.actions';
import { ProjectModel } from 'src/app/store/models/project.model';
import { selectedFormData } from 'src/app/store/selectors/form.selectors';
import { getAllProjects, getProjectByIndex, getSelectedProject } from 'src/app/store/selectors/projects.selectors';
import { CreateSurveyUtilityService } from '../../../../../../services/create-survey/create-survey-utility.service';
import { ManageRatingFormService } from '../../../services/manage-rating-form.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit,OnDestroy {
 sectionNameValid:boolean
 sectionNameValidSub:Subscription
  surveyId: string;

  constructor(
    public util: CreateSurveyUtilityService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private manageRatingFormService: ManageRatingFormService,
    private store: Store<AppState>) {
  }

  onSubmit(): void {
    const payload = this.createPayload()
    //the below will dispatch CreateSurveyStartAction
    this.store.dispatch(new CreateSurveyStart({ surveyId: this.surveyId, surveyData: payload }))
    
  }
  ngOnDestroy(){
    this.sectionNameValidSub.unsubscribe()
  }

  goToManageForms(){
    let index;
    let selProject
    this.store.pipe(select(getSelectedProject)).subscribe(project=>{
       selProject=project
    })
    this.store.pipe(select(getAllProjects)).subscribe(projects=>{
     index= projects.findIndex(project=>{
        return project.projectId==selProject
      })
    })
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
    this.router.navigate(['manage-rating-forms/form/'+index])
  }

  createPayload() {

    let formNameRef;
    const lastUpdate = this.util.getDateTime();
    const allSectionsArr = ((this.util.surveyForm.get('surveyData')) as FormArray).value as Array<any>;
    this.store.pipe(select(selectedFormData)).subscribe(data=>{
      formNameRef=data.formName
    })

    const payload = {
      formName:formNameRef,
      lastUpdate: lastUpdate,
      surveyData: {
        sections: []
      }
    }
    let updatedSectionArray=allSectionsArr.filter(section=>{
      return (section[2] as Array<any>).length!==0
    })
    updatedSectionArray.forEach((section,index) => {
      const sectionQuestions = section[2] as Array<any>

      const sectionName=section[3] !== 'Section '+(index+2) ? section[3]:'Section '+(index+1)
      let questionId, questionData, questionMetaData, optionsMetaData;
      const tempSectionQuestions = []
        const sectionId = 'Section '+ (index+1)
        sectionQuestions.forEach(question => {
          questionId = question.questionId;
          questionData = {
            question: question.question,
            options: question.options,
            media: question.media,
            weightage: question.weightage
          }
          questionMetaData = {
            questionType: question.questionType,
            help: '',
            isMandatory: question.isMandatory ? 'Yes' : 'No',
            attachment: {
              docAttachment: question.docAttachment,
              imageAttachment: question.imageAttachment
            },
            dependentQuestions: {
              isPresent: "No",
              questionLinkedWithOption: []
            }
          }
  
  
          optionsMetaData = {
            inputField: {
              inputFieldRequried: question.inputFieldRequired,
              type: question.inputFieldType,
              metaData: {
                validation: {}
              }
            }
          }
          tempSectionQuestions.push({ questionId, questionData, questionMetaData, optionsMetaData })
        })
        payload.surveyData.sections.push(
          {
            sectionId: sectionId,
            sectionName:sectionName,
            sectionQuestions: tempSectionQuestions
          }
        )
      
    })

    return payload;
  }

  ngOnInit(): void {
   this.sectionNameValidSub=this.util.sectionNameValid.subscribe(value=>{
    this.sectionNameValid=value
   })
    this.store.pipe(select(selectedFormData)).subscribe(formData=>{
      this.surveyId=formData.surveyId
    })
  }
}
