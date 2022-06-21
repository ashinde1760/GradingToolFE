import { CreateFormStart, DeleteFormStart, FormFetchStart, PublishFormStart, SelectForm, UpdateFormStart } from './../../../../../../store/actions/form.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormControl, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import {formsArraySelector, selectedFormData} from '../../../../../../store/selectors/form.selectors'
import { Observable, Subscription } from 'rxjs';
import { FormModel } from 'src/app/store/models/form.model';
import { FetchSurveyStart } from 'src/app/store/actions/survey.actions';
import { pipeFromArray } from 'rxjs/internal/util/pipe';
import { tap } from 'rxjs/operators';
import { CreateSurveyUtilityService } from 'src/app/services/create-survey/create-survey-utility.service';
import { FetchProjectsStart } from 'src/app/store/actions/project.actions';
 


// export interface FormObject{
//   "surveyId":string,
//   "formName": string,
//   "userRolesAllowed":Array<string>,
//   "projectId": string
// }

@Component({
  selector: 'app-form-structure',
  templateUrl: './form-structure.component.html',
  styleUrls: ['./form-structure.component.css']
})
export class FormStructureComponent implements OnInit, OnDestroy {
  formArray:FormModel[]=[];
  sections: any;
  request: FormGroup = new FormGroup({
    formListArray: new FormArray([])
  });
  userRole: Array<string> = [];
  projectId:string;
  formList$:Observable<FormModel[]>
  previewForm=false
  editForm:boolean=false;
  addForm:boolean=false;
  selectedFormIndex=null;
  formListSub: Subscription;
  isPublished: boolean;
  // tempFormList: any[] = [];

  constructor(private router: Router,private route:ActivatedRoute, private store: Store<AppState>,private util:CreateSurveyUtilityService) {}

  // go back to the manage rating page.
  goBack() {
    this.router.navigate(['/manage-rating-forms']);
  }

   ngOnInit(): void {
    let id;
    this.route.params.subscribe(value=>{
      id=value.id
    });
       
         
         this.store.dispatch(new FormFetchStart(id));
        // this.formList$=this.store.pipe(select(formsArraySelector))
        this.formListSub =  this.store.pipe<FormModel[]>(select(formsArraySelector)).subscribe(array=>{
          (this.request.get("formListArray") as FormArray).clear();
          // this.tempFormList = [];
          this.formArray=[...array];
          if(array.length>0){
             array.forEach((form:FormModel) => {
             (this.request.get("formListArray") as FormArray).push( new FormGroup({
              formName: new FormControl(form._formName),
              centerInCharge: new FormControl(form._userRole.find(value=>value==='Center-In-Charge')?true:false), 
              fieldAuditor: new FormControl(form._userRole.find(value=>value==='Field-Auditor')?true:false),
              clientSponsor: new FormControl(form._userRole.find(value=>value==='Client-Sponsor')?true:false),
              date:new FormControl((form._timeOfCreate).slice(0,10)),
              status: new FormControl(form._isPublish ? "Published" : "Not Published")
            }));
            // this.tempFormList.push(form);
            (this.request.get("formListArray") as FormArray).controls.forEach(abControl=>{
              abControl.get('formName').markAsTouched({onlySelf:true})
              if(form._userRole.find(value=>value==='Center-In-Charge')){
  
                abControl.get('centerInCharge').markAsTouched({onlySelf:true})
              }
              if(form._userRole.find(value=>value==='Field-Auditor')){
                
                abControl.get('fieldAuditor').markAsTouched({onlySelf:true})
              }
              if(form._userRole.find(value=>value==='Client-Sponsor')){
                abControl.get('clientSponsor').markAsTouched({onlySelf:true})
  
              }
            })
          
          })
        }
      })     
  }

  addNewForm(){  
    this.editForm=false;
    this.addForm=true;
    (this.request.get('formListArray') as FormArray)['controls'].unshift(new FormGroup({
      formName: new FormControl(null,Validators.required),
      centerInCharge: new FormControl(false), 
      fieldAuditor: new FormControl(false),
      clientSponsor: new FormControl(false),
      date:new FormControl(this.util.getDateTime().slice(0,10)),
      status: new FormControl()
    }))
    this.selectedFormIndex=0;  
  }

  selectedForm(i:number){
    this.isPublished =  this.formArray[i]._isPublish;
    this.selectedFormIndex=i;
    this.store.dispatch(new SelectForm({formId:this.formArray[i]._formId,surveyId:this.formArray[i]._surveyId,formName:this.formArray[i]._formName}))
  }
  onTextChange(){
  }

  deselect(i?:number){
    this.isPublished = false;
    this.editForm=false;
    if(this.addForm){
      (this.request.get('formListArray') as FormArray)['controls'].shift()
      this.selectedFormIndex=null
      this.addForm=false
    }else{
      this.selectedFormIndex=null
      this.store.dispatch(new SelectForm(null))
    }
  }

  goToManageForms(){
    this.router.navigate(['/manage-rating-forms'])
  }
  createFormRequest() {
    this.userRole=[]
    if(this.addForm){
      const formName =  (this.request.get('formListArray') as FormArray)['controls'][0].get('formName').value
      if( (this.request.get('formListArray') as FormArray)['controls'][0].get('centerInCharge').value){
        this.userRole.push('Center-In-Charge');
      }
      if( (this.request.get('formListArray') as FormArray)['controls'][0].get('fieldAuditor').value){
        this.userRole.push('Field-Auditor');
      }
      if( (this.request.get('formListArray') as FormArray)['controls'][0].get('clientSponsor').value){
        this.userRole.push('Client-Sponsor');
      }
      this.store.dispatch(new CreateFormStart({
        _formName: formName,
        _userRole: this.userRole,
        _timeOfCreate:(this.request.get('formListArray') as FormArray)['controls'][0].get('date').value
      }));
    }
    else{
      let surveyId;
      this.store.pipe(select(selectedFormData)).subscribe(form=>{
          surveyId=form.surveyId
      })
      this.store.dispatch(new FetchSurveyStart(surveyId,this.previewForm))
    }
  }

  deleteForm(){
    this.store.dispatch(new DeleteFormStart(
      this.formArray[this.selectedFormIndex]._formId
      ));
      this.selectedFormIndex=null;
      this.store.dispatch(new SelectForm(null))
      this.userRole=[]
  }

  changeEditState(){
    this.editForm=true
  }

  publishFormRequest(){
    let id;
    this.route.params.subscribe(value=>{
      id=value.id
    })
    let formId = this.formArray[this.selectedFormIndex]._formId;
    this.store.dispatch(new PublishFormStart({formId: formId, id: id}));
    this.selectedFormIndex=null;
    this.store.dispatch(new SelectForm(null));
  }
  
  previewFormRequest(){
    this.previewForm=true
    this.createFormRequest();
  }
 
 editFormRequest(){
    this.userRole=[]
    let formName =  (this.request.get('formListArray') as FormArray)['controls'][this.selectedFormIndex].get('formName').value
  if( (this.request.get('formListArray') as FormArray)['controls'][this.selectedFormIndex].get('centerInCharge').value){
    this.userRole.push('Center-In-Charge');
  }
  if( (this.request.get('formListArray') as FormArray)['controls'][this.selectedFormIndex].get('fieldAuditor').value){
    this.userRole.push('Field-Auditor');
  }
  if( (this.request.get('formListArray') as FormArray)['controls'][this.selectedFormIndex].get('clientSponsor').value){
    this.userRole.push('Client-Sponsor');
  }
  this.store.dispatch(new UpdateFormStart({
    _formId:this.formArray[this.selectedFormIndex]._formId,
    _formName: formName,
    _userRole: this.userRole,
  }));
  this.editForm=false
 }

 ngOnDestroy(){
  this.formListSub.unsubscribe();
 }

}
