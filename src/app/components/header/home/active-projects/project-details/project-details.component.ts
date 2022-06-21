import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActiveProjectsManagementService} from "../services/active-projects-management.service";
import {ActivatedRoute, Router} from "@angular/router";
import {select, Store} from "@ngrx/store";
import {AppState} from "../../../../../store";
import {getAllProjects} from "../../../../../store/selectors/projects.selectors";
import {Observable, of, Subscription} from "rxjs";
import {ProjectModel} from "../../../../../store/models/project.model";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { getProgressData } from 'src/app/store/effects/URLs';
import { userJwtToken } from 'src/app/store/selectors/auth.selectors';
import { ReportEffects } from 'src/app/store/effects/report.effects';
import { LogoutEnd } from 'src/app/store/actions/auth.actions';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit,OnDestroy {
  
  avgMarks:number= 0;
  partnersCovered:number= 0;
  totalPartners:number= 0;
  tcCompleted:number= 0;
  totalTC:number= 0
  targetProject: any;
  allProjects$: Observable<ProjectModel[]>;
  jwtToken:string
  projectSubscription:Subscription
  selectprojectSub:Subscription
  
  constructor(
    public activeProjectsManagementService: ActiveProjectsManagementService,
    public activatedRoute: ActivatedRoute,
    public store: Store<AppState>,
    public http:HttpClient,
    private router: Router) {
  }


  ngOnInit(): void {
    let id;
    let projects
    let targetProject:ProjectModel;
   
    this.store.pipe(select(userJwtToken)).subscribe(jwtToken => {
      this.jwtToken = jwtToken;
  });
    this.allProjects$ = this.store.pipe(select(getAllProjects));
      this.projectSubscription= this.allProjects$.subscribe(pro => {
        projects=pro
       
      });


    this.selectprojectSub=this.activeProjectsManagementService.selectedProjectIndex.subscribe((value)=>{
      if(value){
        this.http.get(getProgressData+value,{
          headers:{
            jwtToken:this.jwtToken
          } 
        }).subscribe((response:{avgMarks:number,
                               partnersCovered:number, 
                               totalPartners: number,
                               tcCompleted: number,
                               totalTC: number,
                              })=>{
          this.avgMarks=+response.avgMarks;
          this.tcCompleted=response.tcCompleted;
          this.totalPartners=response.totalPartners;
          this.totalTC=response.totalTC;
          this.partnersCovered=response.partnersCovered;
        },
        (error: HttpErrorResponse) =>{
         if(error.error["errorCode"] == 401){
           this.router.navigateByUrl('/auth');
           this.store.dispatch(new LogoutEnd());
         }
        }
       )   
      } 
    })
  }

  ngOnDestroy(){
    this.selectprojectSub.unsubscribe()
    this.projectSubscription.unsubscribe()
  }
}
