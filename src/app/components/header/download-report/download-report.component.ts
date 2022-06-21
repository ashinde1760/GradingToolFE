import { Observable, of, Subscription } from 'rxjs';
import { ListUserStarts } from './../../../store/actions/user.action';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { FetchProjectReportStart, FetchPartnerReportStart, FetchTrainingCenterReportStart} from "../../../store/actions/report.actions";
import * as downloadActions from "src/app/store/actions/download-report.actions";
import { User } from '../../../store/models/user';
import { ListPartnerStarts, PartnerWithTrainingCenters, TrainingCenterDetail } from '../../../store/actions/patner.actions';
import { ProjectModel } from '../../../store/models/project.model';
import { getAllProjects } from '../../../store/selectors/projects.selectors';
import { tap } from 'rxjs/operators';
import { loadUsers } from '../../../store/selectors/user.selectors';
import { loadPartners } from '../../../store/selectors/partner.selectors';
import { DownloadReportEffects } from 'src/app/store/effects/download-report.effects';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LogoutEnd } from 'src/app/store/actions/auth.actions';
import { FetchProjectsStart } from 'src/app/store/actions/project.actions';

@Component({
  selector: 'app-download-report',
  templateUrl: './download-report.component.html',
  styleUrls: ['./download-report.component.css']
})
export class DownloadReportComponent implements OnInit, OnDestroy {

  users$: Observable<User[]>;
  projects$: Observable<ProjectModel[]>;
  partners$: Observable<PartnerWithTrainingCenters[]>;
  usres: Array<User> = [];
  projects: Array<ProjectModel> = [];
  trainingCenters: Array<TrainingCenterDetail[]> = [];
  partners: Array<any> = [];
  selectedType:string='';
  previewType:boolean=false;
  isTraingCenterVisible:boolean = false;
  projectId: string ='';
  partnerId: string ='';
  tcId: string ='';
  isDisable: boolean= true;
  isLoading = false;
  projectSubcription: Subscription;
  partnerSubcription: Subscription;

  constructor(
    private store: Store<AppState>, 
    private downloadReportEffect: DownloadReportEffects, 
    private loadingSpinner: LoadingSpinnerService,
    private router: Router
    ) { }

  ngOnInit(): void {
    // to get the projects
    this.store.dispatch(new FetchProjectsStart());
    this.projects$ = this.store.pipe(select(getAllProjects));
    // to get the users
    this.store.dispatch(new ListUserStarts());
    this.users$ = this.store.pipe(select(loadUsers));
    // to get the list of partners
    this.store.dispatch(new ListPartnerStarts());
    this.partners$ = this.store.pipe(select(loadPartners));
    
     this.getProjectList();
     this.getPartnerList();
     this.getTrainingCeneterList();

     this.loadingSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });
  }

  ngOnDestroy(){
    this.projectSubcription.unsubscribe();
    this.partnerSubcription.unsubscribe();
  }

 setSelectedType(event){
  this.selectedType=event.target.value;
  this.previewType=false;
  if(this.selectedType !== "Training Center"){
    this.isTraingCenterVisible = false;
  }
  this.isDisable = true;
 }

 // On selecting the partner from the dropdown list and based on that selected partner the training center list will show.
 selectPartner(event){
  this.isTraingCenterVisible = false; 
  this.partnerId = event.target.value;
  this.downloadReportEffect.getTraingCenter(event.target.value).subscribe(
    (data: any) => {
      if(data.traningCentersDetails.length > 0){
        this.isTraingCenterVisible = true;
        this.trainingCenters = [...data.traningCentersDetails];
      }
    },
    (error: HttpErrorResponse) =>{
      if(error.error["errorCode"] == 401){
        this.router.navigateByUrl('/auth');
        this.store.dispatch(new LogoutEnd());
      }
    }
  )
  this.enable();
  this.tcId ="";
 }

 // to select the project from list
 selectProject(event){
   this.projectId = event.target.value;
   this.enable();
 }

 // to select the training center from list
 selectTrainingCenter(event){
   this.tcId = event.target.value;
   this.enable();
 }

 //to get preview of report of selected type(project/partner/training center) and its related parameter.
 setPreview(event){
  this.previewType=!this.previewType; 
  if(!this.previewType){
  }else{
    this.loadingSpinner.isLoading.next(true);
    switch(this.selectedType){
      case "Project":
      {
          let reportType = "projectReport";
          let projectId = this.projectId;
          this.store.dispatch(new FetchProjectReportStart({ reportType, projectId })); 
          break;
      }
      case "Partner":
      {
        let reportType = "partnerReport";
        let projectId = this.projectId;
        let partnerId = this.partnerId;
        this.store.dispatch(new FetchPartnerReportStart({reportType, partnerId, projectId}));
          break;
      }
      case "Training Center":
      {
        let reportType = "trainingCenterReport";
        let projectId = this.projectId;
        let partnerId = this.partnerId;
        let tcId = this.tcId;
        this.store.dispatch(new FetchTrainingCenterReportStart({reportType, tcId, partnerId, projectId}));
          break;
      }
      default:
        {
          this.loadingSpinner.isLoading.next(false);
          break;
        }
    }
  }
 }

  getProjectList(){
    this.projectSubcription = this.projects$.subscribe(projects => {
      this.projects = projects
    });
  }

  getPartnerList(){
    this.partnerSubcription = this.partners$.subscribe(partners => {
      this.partners = [];
      partners.forEach(partner =>{     
        this.partners.push(partner);
      });
    })
  }

  getTrainingCeneterList(){
  }

  //to download the report of selected type(project/partner/training center) and its related parameter.
  downloadReport(event){
    this.loadingSpinner.isLoading.next(true);
    switch(this.selectedType){
      case "Project":
      {
          let reportType = "projectReport";
          let projectId = this.projectId;
          this.store.dispatch(new downloadActions.DownloadProjectReportStart({ reportType, projectId }));    
          break;
      }
      case "Partner":
      {
        let reportType = "partnerReport";
        let projectId = this.projectId;
        let partnerId = this.partnerId;
        this.store.dispatch(new downloadActions.DownloadPartnerReportStart({reportType, partnerId, projectId}));
          break;
      }
      case "Training Center":
      {
        let reportType = "trainingCenterReport";
        let projectId = this.projectId;
        let partnerId = this.partnerId;
        let tcId = this.tcId;
        this.store.dispatch(new downloadActions.DownloadTrainingCenterReportStart({reportType, tcId, partnerId, projectId}));
          break;
      }
      default:
        {
          this.loadingSpinner.isLoading.next(false);
          break;
        }
    }

  }

  //to download of attachment for(training center) and its related parameter.
  downloadAttachment(event){
    let reportType = "trainingCenterReport";
    let projectId = this.projectId;
    let partnerId = this.partnerId;
    let tcId = this.tcId;
    this.loadingSpinner.isLoading.next(true);
    this.store.dispatch(new downloadActions.DownloadAttachmentStart({reportType, projectId, partnerId, tcId }));
  }

  enable(){
    if(this.selectedType === "Project"){
      if(this.projectId !== "" && this.projectId !== null){
        this.isDisable = false;
      }
   }else if(this.selectedType === "Partner"){
    if(this.projectId !== "" && this.projectId !== null && this.partnerId !== "" && this.partnerId !== null){
      this.isDisable = false;
    }
   }else if(this.selectedType === "Training Center"){
    if(this.projectId !== "" && this.projectId !== null && this.partnerId !== "" && this.partnerId !== null && this.tcId !== "" && this.tcId !== null){
      this.isDisable = false;
    }
   }
   else{
   }
  }
}
