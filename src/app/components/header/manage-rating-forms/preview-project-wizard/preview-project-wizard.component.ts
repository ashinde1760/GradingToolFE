import { Observable } from 'rxjs';
import { getAllProjects, fetchProjectById } from './../../../../store/selectors/projects.selectors';
import { FetchProjectsStart } from './../../../../store/actions/project.actions';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { ActiveProjectsManagementService } from "../../home/active-projects/services/active-projects-management.service";
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../store';
import { tap, map } from 'rxjs/operators';
import { ProjectModel } from '../../../../store/models/project.model';
import { FormGroup } from '@angular/forms';
import { ManageRatingFormService } from '../services/manage-rating-form.service';

@Component({
  selector: 'app-preview-project-wizard',
  templateUrl: './preview-project-wizard.component.html',
  styleUrls: ['./preview-project-wizard.component.css']
})
export class PreviewProjectWizardComponent implements OnInit {

  targetProject$: Observable<ProjectModel>;
  projectList$: Observable<ProjectModel[]>;
  projects: Observable<ProjectModel[]>;
  previewProjectWizard: FormGroup;
  projectId: string;
  projectTitle: string;
  invalidEndDate = false;
  invalidStartDate = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, public activeProjectsManagementService: ActiveProjectsManagementService, private store: Store<AppState>, private util: ManageRatingFormService) {
  }

  fetchProject(event) {

    this.projectId = ((event.target) as HTMLInputElement).value;
    this.targetProject$ = this.store.pipe(select(fetchProjectById, { projectId: this.projectId }));
    this.populateFields();
  }

  createForm() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
          "projectId"   : this.projectId,
      }
  };
    this.router.navigate(['manage-rating-forms/preview-project-wizard/project'], navigationExtras);
  }

  goBack() {
    this.router.navigate(['/manage-rating-forms']);
  }

  ngOnInit(): void {
    this.previewProjectWizard = this.util.createEditProjectWizardForm();
    this.projectList$ = this.store.pipe(select(getAllProjects));
    this.projects = this.projectList$.pipe(
      map(projects => projects));
  }

  private populateFields(targetProject$?: Observable<ProjectModel>): void {
    targetProject$ = targetProject$ ? targetProject$ : this.targetProject$;
    targetProject$.subscribe(project => {
      this.projectId = project.projectId;

      this.projectTitle = project.title;
      const startDate = project.startDate.split(' ');
      const modifiedStartDate = startDate[0].split('-').reverse().join('-');

      const endDate = project.endDate.split(' ');
      const modifiedEndDate = endDate[0].split('-').reverse().join('-');

      this.previewProjectWizard.setValue(
        {
          title: project.title,
          description: project.description,
          startDate: modifiedStartDate,
          endDate: modifiedEndDate
        });
    });
  }

}
