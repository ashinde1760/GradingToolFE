import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../store";
import { FetchProjectsStart } from "../../../store/actions/project.actions";
import { Observable } from "rxjs";
import { ProjectModel } from "../../../store/models/project.model";
import { getAllProjects } from "../../../store/selectors/projects.selectors";
import { FetchSurveyStart } from 'src/app/store/actions/survey.actions';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit {

  allProjects$: Observable<ProjectModel[]>

  constructor(
    private router: Router,
    private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.store.dispatch(new FetchProjectsStart());
    this.allProjects$ = this.store.pipe(select(getAllProjects)); 
  }

   // to navigate the add new project wizard.
  addProject() {
    this.router.navigate(['/manage-rating-forms/create-project-wizard']);
  }

  // to navigate the project details with projectId.
  navigateToProject(projectId): void {
    this.router.navigate([`home/project/${projectId}`]);
  }
}
