import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActiveProjectsManagementService } from '../../home/active-projects/services/active-projects-management.service';
import { FormGroup } from '@angular/forms';
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../../store";
import { Observable } from "rxjs";
import { ProjectModel } from "../../../../store/models/project.model";
import { fetchProjectById, getAllProjects, getProjectByIndex } from "../../../../store/selectors/projects.selectors";
import { ManageRatingFormService } from "../services/manage-rating-form.service";
import { DeleteProjectStart, FetchProjectsStart, UpdateProjectStart } from "../../../../store/actions/project.actions";
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';

@Component({
  selector: 'app-edit-project-wizard',
  templateUrl: './edit-project-wizard.component.html',
  styleUrls: ['./edit-project-wizard.component.css']
})
export class EditProjectWizardComponent implements OnInit {
  targetProject$: Observable<ProjectModel>;
  editProjectWizard: FormGroup;
  availableProjects$: Observable<ProjectModel[]>;
  projectId: string;
  projectTitle: string;
  invalidEndDate = false;
  invalidStartDate = false;
  invalidSelfAssmntDeadLine = false;
  isLoading: boolean = false;
  selectedStartDate: number=null;
  selectedEndDate: number=null;
  endDate:number;
  startDate:number;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public activeProjectsManagementService: ActiveProjectsManagementService,
    private util: ManageRatingFormService,
    private store: Store<AppState>,
    private loadingSpinner: LoadingSpinnerService) {
  }


  fetchProject(event): void {
    this.projectId = ((event.target) as HTMLInputElement).value;

    this.targetProject$ = this.store.pipe(select(fetchProjectById, { projectId: this.projectId }));
    this.populateFields();
  }

  
  proceedToSurveyFormEdit(): void {
    const projectName = this.editProjectWizard.get('title').value;
    const projectDescription = this.editProjectWizard.get('description').value;

    let startDate = this.editProjectWizard.get('startDate').value as string;
    let endDate = this.editProjectWizard.get('endDate').value as string;
    let selfAssesmentDeadLine = this.editProjectWizard.get('selfAssesmentDeadLine').value as string;
    this.invalidEndDate = Date.parse(endDate) - Date.parse(startDate) <= 0;
    this.invalidStartDate = new Date().getTime() - Date.parse(startDate) <= 0;
    
    this.invalidSelfAssmntDeadLine = new Date(selfAssesmentDeadLine).getTime() - Date.parse(startDate) <= 0 && Date.parse(selfAssesmentDeadLine) - Date.parse(endDate) <= 0;;

    endDate = endDate.split('-').reverse().join('-');
    startDate = startDate.split('-').reverse().join('-');
    selfAssesmentDeadLine = selfAssesmentDeadLine.split('-').reverse().join('-');

    // if (this.editProjectWizard.valid && !this.invalidEndDate && !this.invalidStartDate) {
    if (this.editProjectWizard.valid) {
      this.loadingSpinner.isLoading.next(true);
      this.store.dispatch(new UpdateProjectStart(
        {
          projectId: this.projectId,
          projectData: {
            projectName: projectName,
            projectDescription: projectDescription,
            startDate: startDate,
            endDate: endDate,
            selfAssignmentDeadLine: selfAssesmentDeadLine
          }
        }
      ));
    }

  }

  onStartDateSelect(){
    let startDate = this.editProjectWizard.get('startDate').value as string;
    this.selectedStartDate=Date.parse(startDate);
  }

  onEndDateSelect(){
    let endDate = this.editProjectWizard.get('endDate').value as string;
    this.selectedEndDate=Date.parse(endDate)
  }

  deleteProject() {
    this.loadingSpinner.isLoading.next(true);
    this.store.dispatch(new DeleteProjectStart(this.projectId));
    // this.selectedStartDate=null
    // this.selectedEndDate=null;
    // this.endDate=null
    // this.startDate=null
  }

  goBack(): void {
    this.router.navigate(['/manage-rating-forms']);
    this.selectedStartDate=null
  this.selectedEndDate=null;
  this.endDate=null
  this.startDate=null
  }


  ngOnInit(): void {
    this.store.dispatch(new FetchProjectsStart())
    this.availableProjects$ = this.store.pipe(select(getAllProjects));
    this.editProjectWizard = this.util.createEditProjectWizardForm();
    this.setTargetProject();
    this.loadingSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });
  }

  /** 
   * if user is directly editing the project from the home page the 'projectIndex will not be undefined
   * and can be retrieved from the url segment.
   */
  private setTargetProject() {
    let projectIndex;
    this.activatedRoute.params.subscribe(params => {
      projectIndex = params.projectId;
    });
    if (projectIndex !== undefined) {
      this.targetProject$ = this.store.pipe(select(getProjectByIndex, { projectIndex }));
      this.populateFields(this.targetProject$);
    }
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
      const selfAssesmentDeadLine = project.selfAssesmentDeadLine.split(' ');
      const modifiedSelfAssesmentDeadLine = selfAssesmentDeadLine[0].split('-').reverse().join('-');
      
      this.selectedStartDate=Date.parse(modifiedStartDate)
      this.startDate=Date.parse(modifiedStartDate)
      this.selectedEndDate=Date.parse(modifiedEndDate)
      this.editProjectWizard.setValue(
        {
          title: project.title,
          description: project.description,
          startDate: modifiedStartDate,
          endDate: modifiedEndDate,
          selfAssesmentDeadLine: modifiedSelfAssesmentDeadLine
        });
    });
  }
}
