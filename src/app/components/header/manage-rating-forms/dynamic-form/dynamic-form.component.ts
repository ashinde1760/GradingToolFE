import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { QuestionBase } from "../../../../util/question-base";
import { FormGroup } from "@angular/forms";
import { QuestionControllerService } from "../../../../services/question-controller-service/question-controller.service";

import { DependentQuestionService } from "../../../../services/dependent-question-service/dependent-question-service.service";

import { QuestionDataService } from "../../../../services/question-data/question-data.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { ProjectModel } from "../../../../store/models/project.model";
import { SurveyModel } from "../../../../store/models/survey.model";
import { AppState } from "../../../../store";
import { Store, select } from "@ngrx/store";
import { fetchProjectById, getAllProjects, getSelectedProject } from "../../../../store/selectors/projects.selectors";
import { getAllSurveys, getSurveyById } from "../../../../store/selectors/survey.selectors";
import { IndividualSurveyType } from "src/app/store/effects/survey.effects";
import { FetchSurveyEnd } from "src/app/store/actions/survey.actions";
import { map } from "rxjs/operators";

@Component({
  selector: "app-dynamic-form",
  templateUrl: "./dynamic-form.component.html",
  styleUrls: ["./dynamic-form.component.css"],
})
export class DynamicFormComponent implements OnInit,OnDestroy {
  sections:any[]=[];
  form: FormGroup;
  payLoad = "";
  projectId: string;
  sectionName: string;
  sectionWithquestion = new Map();
  sectionNames = [];
  isFormAvailable: boolean;
  targetProject$: Observable<ProjectModel>;
  surveys$: Observable<IndividualSurveyType>;
  surveysSub:Subscription
  getSelectedProjectSub:Subscription
  getAllProjectsSub:Subscription
  constructor(private qcs: QuestionControllerService, private service: DependentQuestionService, private questionData: QuestionDataService, private router: Router, public route: ActivatedRoute, private store: Store<AppState>) {
  }

  ngOnDestroy(){
    this.store.dispatch(new FetchSurveyEnd({survey:null}));
    if(this.surveysSub){
      this.surveysSub.unsubscribe();
    }
    if(this.getAllProjectsSub){
      this.getAllProjectsSub.unsubscribe();
    }
    if(this.getSelectedProjectSub){
      this.getSelectedProjectSub.unsubscribe();
    }
  }

  ngOnInit() { 
      this.surveys$ = this.store.pipe(select(getAllSurveys));
      this.surveysSub=this.surveys$.subscribe(survey => {
        if(survey!==null){
          if (survey["surveyData"] && survey["surveyData"]["sections"].length>0) {
            this.isFormAvailable = true;
            this.service.getQuestions(survey["surveyData"], this.sectionWithquestion, this.sectionNames);
          this.sectionWithquestion.forEach((value,key)=>{
            this.sections.push({sectionId:key,questions:value})
          })
          } else{
            this.isFormAvailable = false;
          }
        }else{
          this.router.navigate(['manage-rating-forms/edit-project-wizard'])
        }

      });
  
  }

  goBack(){
    let index;
    let selProject
    this.getSelectedProjectSub=this.store.pipe(select(getSelectedProject)).subscribe(project=>{
      
       selProject=project
    })
    this.getAllProjectsSub=this.store.pipe(select(getAllProjects)).subscribe(projects=>{
     index= projects.findIndex(project=>{
        return project.projectId==selProject
      })
    })
    this.router.navigate(['manage-rating-forms/form/'+index]);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
  }

  getQuestionBySection(section) {
    this.sections = this.sectionWithquestion.get(section);
  }
}
