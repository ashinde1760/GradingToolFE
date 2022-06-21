import { SectionQuestions } from './../../util/FormType';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { QuestionDataService } from '../question-data/question-data.service';
import { QuestionService } from '../question-service/question.service';
import { ProjectModel } from '../../store/models/project.model';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { fetchProjectById } from '../../store/selectors/projects.selectors';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { getSurveyById } from '../../store/selectors/survey.selectors';
import { SurveyModel } from '../../store/models/survey.model';
import { QuestionBase } from '../../util/question-base';

@Injectable({
  providedIn: 'root'
})
export class DependentQuestionService {

  targetProject$: Observable<ProjectModel>;
  surveys$: Observable<SurveyModel[]>;
  sectionName: string;


  constructor(private questionDataService: QuestionDataService, private qs: QuestionService, private store: Store<AppState>) {

  }

  getQuestions(survey: any, sectionWithquestion: any, sectionNames: Array<string>) {
    let isDependent: boolean = false;
    let data: any;
    let sectionQuestions: any;
    let surveyData: any;
    let dependentQuestion: any;
    let questionMetaData: any;
    let questions: QuestionBase<string>[];

    const optionsAndQuestionMap = new Map();
    let tempDependentQuestionList = [];

          surveyData = survey["sections"];

          for (let i = 0; i < surveyData.length; i++) {
            const data = surveyData[i];
            sectionQuestions = data["sectionQuestions"];
            questions = [];
            for (let j = 0; j < sectionQuestions.length; j++) {
              if (sectionNames.indexOf(data["sectionName"]) == -1)
                sectionNames.push(data["sectionName"]);
             this.qs.generateQuestion(sectionQuestions[j], questions);
            }
            sectionWithquestion.set(data["sectionName"], questions);
          }
        

    return questions;


  }
}
