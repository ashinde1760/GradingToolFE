import { loadUsers } from './../../../../store/selectors/user.selectors';
import { ListUserStarts, FilterUserStarts } from './../../../../store/actions/user.action';
import { ListPartnerStarts, PartnerWithTrainingCenters } from './../../../../store/actions/patner.actions';
import { loadSchedulerDetails } from './../../../../store/selectors/scheduler.selectors';
import { Observable, of, Subscription } from 'rxjs';
import { ListSchedulerStarts, FilterByStarts, Scheduler, UpdateScheduler, UpdateSchedulerStarts } from './../../../../store/actions/scheduler.actions';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../store';
import { tap } from 'rxjs/operators';
import { ProjectModel } from '../../../../store/models/project.model';
import { getAllProjects } from '../../../../store/selectors/projects.selectors';
import { loadPartners } from '../../../../store/selectors/partner.selectors';
import { PartnerDetailsPayloadType } from '../../../../store/actions/master-data.action';
import { User } from '../../../../store/models/user';
import { SchedulerEffects } from 'src/app/store/effects/scheduler.effects';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { Router } from '@angular/router';
import { LogoutEnd } from 'src/app/store/actions/auth.actions';
import { FetchProjectsStart } from 'src/app/store/actions/project.actions';

@Component({
  selector: 'app-schedular',
  templateUrl: './schedular.component.html',
  styleUrls: ['./schedular.component.css']
})
export class SchedularComponent implements OnInit, OnDestroy {

  selectedForm: string = 'Select Form';
  selectedPartner: string = 'Select Partner';
  fielAudtor: string = '';
  selectedRow: number;
  formType:string=null;
  partnerAndTrainingCenterList: any = [];
  finalDate: any = [];
  tainingCenterAndFieldAuditorMap = new Map();
  fieldAuditorAndDateList = new Map();
  isEnable: boolean = false;
  filedAuditor: string = 'No Auditor';
  editableRow: number;
  grading=[{
    'partnerName':'ravi',
    'clientSponserName':'csName',
    'clientSponserContact':'csContact',
    'projectName':'Project',
    'formName':'Form name',
    'selfAssessmentStatus':'good',
    'selfAssessmen Date':null,
    'fieldAuditorName':'faName',
    'fieldAuditorContact':32434324,
    'auditDate ':null,
    'isAudit Cancel':true,
  },{
    'partnerName':'ravi',
    'clientSponserName':'csName',
    'clientSponserContact':'csContact',
    'projectName':'Project',
    'formName':'Form name',
    'selfAssessmentStatus':'good',
    'selfAssessmentDate':null,
    'fieldAuditorName':'faName',
    'fieldAuditorContact':32434324,
    'auditDate ':null,
    'isAudit Cancel':true,
  },{
    'partnerName':'ravi',
    'clientSponserName':'csName',
    'clientSponserContact':'csContact',
    'projectName':'Project',
    'formName':'Form name',
    'selfAssessmentStatus':'good',
    'selfAssessmentDate':null,
    'fieldAuditorName':'faName',
    'fieldAuditorContact':32434324,
    'auditDate ':null,
    'isAudit Cancel':true,
  },{
    'partnerName':'ravi',
    'clientSponserName':'csName',
    'clientSponserContact':'csContact',
    'projectName':'Project',
    'formName':'Form name',
    'selfAssessmentStatus':'good',
    'selfAssessmentDate':null,
    'fieldAuditorName':'faName',
    'fieldAuditorContact':32434324,
    'auditDate ':null,
    'isAudit Cancel':true,
  }]
  ratingOb=[{
    'partnerName':'raj',
    'trainingCenter':'tc1',
    'trainingCenterID':'tcid',
    'centerInChargeName':'ciName',
    'projectName':'Project',
    'formName':'Formasdasdasdasdasd name',
    'selfAssessmentStatus':'good',
    'selfAssessmentDate':null,
    'fieldAuditor Name':'faName',
    'fieldAuditorContact':32434324,
    'auditDate ':null,
    'isAuditCancel':true,
    
  },{
    'partnerName':'raj',
    'trainingCenter':'tc1',
    'trainingCenterID':'tcid',
    'centerInChargeName':'ciName',
    'projectName':'Project',
    'formName':'Form name',
    'selfAssessmentStatus':'good',
    'selfAssessmentDate':null,
    'fieldAuditorName':'faName',
    'fieldAuditorContact':32434324,
    'auditDate ':null,
    'isAuditCancel':true,
    
  },{
    'partnerName':'raj',
    'trainingCenter':'tc1',
    'trainingCenterID':'tcid',
    'centerInChargeName':'ciName',
    'projectName':'Project',
    'formName':'Form name',
    'selfAssessmentStatus':'good',
    'selfAssessmentDate':null,
    'fieldAuditorName':'faName',
    'fieldAuditorContact':32434324,
    'auditDate ':null,
    'isAuditCancel':true,
    
  },{
    'partnerName':'raj',
    'trainingCenter':'tc1',
    'trainingCenterID':'tcid',
    'centerInChargeName':'ciName',
    'projectName':'Project',
    'formName':'Form name',
    'selfAssessmentStatus':'good',
    'selfAssessmentDate':null,
    'fieldAuditorName':'faName',
    'fieldAuditorContact':32434324,
    'auditDate ':null,
    'isAuditCancel':true,
    
  }]
  filterBy$: Observable<Scheduler[]>;
  projects$: Observable<ProjectModel[]>;
  partners$: Observable<PartnerWithTrainingCenters[]>;
  patnerList: any = ['Tata', 'Airtel', 'Idea', 'Vodafone'];
  trainCenterList: any = ['Qspider', 'ABC', 'Jspider'];
  fieldAuditorList$: Observable<User[]>;
  displayform: Scheduler[];
  isEditMode: boolean;
  shedularResponse: Scheduler[];
  schedularDetailsSubscription: Subscription;
  projectListSubscription: Subscription;
  partnerListSubscription: Subscription;
  currentDate: number;
  fieldAuditors: Array<any> = [];
  isFieldAuditorFilled = false;
  isAuditCancelFlag: boolean;
  selectedRowOnIsCancel: number;
  partnerName: string = "";
  projectName: string = "";
  isLoading: boolean = false;
  isApplyDisabled: boolean = true;

  constructor(private store: Store<AppState>, private schedularEffect: SchedulerEffects, private toastr: ToastrService, private loadingSpinner: LoadingSpinnerService,private router: Router) { }

  ngOnInit(): void {
    this.currentDate = Date.now();
    this.isEditMode = false;
    this.isEnable = true;

    this.store.dispatch(new FetchProjectsStart());
    this.store.dispatch(new ListPartnerStarts());
    this.store.dispatch(new ListUserStarts());
    this.store.dispatch(new FilterUserStarts({role: 'Field-Auditor'}));
    this.projects$ = this.store.pipe(select(getAllProjects));
    this.partners$ = this.store.pipe(select(loadPartners));
    this.fieldAuditorList$= this.store.pipe(select(loadUsers));
    this.schedularEffect.getFieldAuditors("Field-Auditor").subscribe((data) => {
      data.users.forEach(element => {
        let auditor = {
          "name": element.firstName,
          "contact": element.phone,
          "userId": element.userId
        };
        this.fieldAuditors.push(auditor)
      });
    },
    (error: HttpErrorResponse) =>{
      if(error.error["errorCode"] == 401){
        this.router.navigateByUrl('/auth');
        this.store.dispatch(new LogoutEnd());
      }
      this.toastr.error('Loading Field Auditors','Failed');
    });
    this.loadingSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });
  }

  selectForm(event){
    if(!this.isApplyDisabled){
      event.target.closest("div").querySelector("form").reset();
      this.filterReset();
    }
    this.isAuditCancelFlag = false;
    this.resetActionControl();
    this.formType= event.target.value;
    let schedularType = this.getSchedularType();
    this.loadingSpinner.isLoading.next(true);
    this.store.dispatch(new ListSchedulerStarts({
      schedulerType: schedularType
    }));
    this.schedularDetailsSubscription = this.store.pipe(select(loadSchedulerDetails)).subscribe((data) =>{
      this.shedularResponse = data;
      this.displayform = this.shedularResponse !== null ? [...this.shedularResponse]: null;
    });
  }

  selectProject(event) {
    this.isAuditCancelFlag = false;
    this.projectName = event.target.value;
  }

  selectPartner(event) {
    this.isAuditCancelFlag = false;
    this.partnerName = event.target.value;
  }

  filterReset(){
    this.projectName = "";
    this.partnerName = "";
    this.isApplyDisabled = true;
    if(this.formType != null){
      let schedularType = this.getSchedularType();
      this.loadingSpinner.isLoading.next(true);
      this.store.dispatch(new ListSchedulerStarts({
        schedulerType: schedularType
      }));
      this.schedularDetailsSubscription = this.store.pipe(select(loadSchedulerDetails)).subscribe((data) =>{
        this.shedularResponse = data;
        this.displayform = this.shedularResponse !== null ? [...this.shedularResponse]: null;
      });
    }
  }

  filetrBy(){
    this.isAuditCancelFlag = false;
    let schedularType = this.getSchedularType();
    this.loadingSpinner.isLoading.next(true);
    this.store.dispatch(new FilterByStarts({ 
      projectName: this.projectName,
      partnerName: this.partnerName,
      schedulerType: schedularType
    }));
    this.projectListSubscription = this.store.pipe(select(loadSchedulerDetails)).subscribe((data)=>{
      this.shedularResponse = data;
      this.displayform = this.shedularResponse !== null ? [...this.shedularResponse]: null;
    });
  }

  setApply(){
    this.isApplyDisabled = (this.projectName === "" || typeof this.projectName === "undefined")&&(this.partnerName === "" || typeof this.partnerName === "undefined") || (this.getSchedularType() =="" || typeof this.getSchedularType() == "undefined");
  }

  onEdit(event, i){
    this.editableRow = i;
    this.isEnable = false;
    this.isEditMode = true;
    if(this.shedularResponse[i].fieldAuditorId != null){
      this.isFieldAuditorFilled = true;
    }
    // let editableElements = event.target.closest("tr").getElementsByClassName("editable");
    // for(let element of editableElements){
    //   element.disabled = false;
    // }
  }

  cancel(event){
    this.isEnable = true;
    this.isEditMode = false;
    this.isFieldAuditorFilled = false;
    let schedularType = this.getSchedularType();
    this.store.dispatch(new ListSchedulerStarts({
    schedulerType: schedularType
    }));
  }

  selectContact(event, i){
    this.isFieldAuditorFilled = true;
    let userId = event.target.value;
    let auditor = this.fieldAuditors.filter(x => {return x.userId === userId});
    let selectedAuditorContact = auditor[0].contact;
    let updatedSchedular = new Scheduler(this.displayform[i].selfAssignmentStatus, 
                                         this.displayform[i].partnerName,
                                         auditor[0].userId,
                                         this.displayform[i].isAuditCancel,
                                         auditor[0].name,
                                         this.displayform[i].projectMappingId,
                                         this.displayform[i].selfAssignmentDate,
                                         this.displayform[i].tcName,
                                         this.displayform[i].auditStatus,
                                         this.displayform[i].partnerId,
                                         this.displayform[i].tcId,
                                         this.displayform[i].projectName,
                                         this.displayform[i].projectId,
                                         this.displayform[i].auditDate,
                                         this.displayform[i].centerInchargeName,
                                         this.displayform[i].formName,
                                         this.displayform[i].clientSponsorName,
                                         this.displayform[i].clientSponsorContact,
                                         this.displayform[i].formId,
                                         selectedAuditorContact);
    this.displayform[i] = updatedSchedular;
    //event.target.closest("td").getElementsByClassName("contact")[0].getElementsByTagName("p")[0].textContent = selectedAuditorContact; 
  }

  isAuditStatusCheck(event, i){
    this.isAuditCancelFlag = event.target.checked;
    this.selectedRowOnIsCancel = i;
    
  }

  ngOnDestroy(){
    this.resetActionControl();
    if(this.projectListSubscription){
      this.projectListSubscription.unsubscribe();
    }
    if(this.partnerListSubscription){
    this.partnerListSubscription.unsubscribe();
    }
    if(this.schedularDetailsSubscription){
      this.schedularDetailsSubscription.unsubscribe();
    }
  }

  update(fieldAuditorName, fieldAuditorContact, isAuditCancel, auditDate, i){
    let auditorId = fieldAuditorName.value;
    let auditorContact = fieldAuditorContact.innerHTML;
    let isAuditCancelValue = isAuditCancel.checked;
    let auditDateValue = auditDate.value;
    let schedular = this.shedularResponse[i];
    let reqBody = {
    "projectId": schedular.projectId,
    "partnerId": schedular.partnerId,
    "formId": schedular.formId,
    "fieldAuditorId": auditorId,
    "isAuditCancel": isAuditCancelValue,
    "auditStatus":true,
    "auditDate": this.dateFormatter(auditDateValue),
    ...(
    this.formType === "rating" && {tcId: schedular.tcId}
    )
    };
    let schedularType =this.getSchedularType();
    this.loadingSpinner.isLoading.next(true);
    if(auditorId != ""){
    if(auditDateValue != ""){
    this.store.dispatch(new UpdateSchedulerStarts({schedulerType: schedularType, reqBody}));
    }
    else{
    this.loadingSpinner.isLoading.next(false);
    this.toastr.error('Please enter the audit date.','Failed');
    let schedularType = this.getSchedularType();
    this.store.dispatch(new ListSchedulerStarts({
    schedulerType: schedularType
    }));
    }
    }else{
    this.store.dispatch(new UpdateSchedulerStarts({schedulerType: schedularType, reqBody}));
    }
    this.isEnable = true;
    this.isEditMode = false;
    this.isFieldAuditorFilled = false;
    }

  dateFormatter(date: string){
    return date.split('-').reverse().join('-');
  }

  resetActionControl(){
    this.isFieldAuditorFilled = false;
    this.isEnable = true;
    this.isEditMode = false; 
  }

  getSchedularType(){
    let schedularType = "";
    switch(this.formType){
      case "grading":
        schedularType = "gradingType";
        break;
      case "rating":
        schedularType = "ratingType";
        break;
      default:
      break;
    }
    return schedularType;
  }
}
