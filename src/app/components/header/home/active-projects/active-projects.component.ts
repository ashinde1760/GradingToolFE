import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActiveProjectsManagementService } from './services/active-projects-management.service';
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../../store";
import { SelectProject } from "../../../../store/actions/project.actions";
import { Observable, Subscription } from "rxjs";
import { ProjectModel } from "../../../../store/models/project.model";
import { getAllProjects } from "../../../../store/selectors/projects.selectors";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { map } from "rxjs/operators";
@Component({
  selector: 'app-active-projects',
  templateUrl: './active-projects.component.html',
  styleUrls: ['./active-projects.component.css'],
  animations: [
    trigger('animate', [
      state('normal', style(
        {
          'border-radius': '4px',
          'width': '190px',
          'height': '190px',
          'box-shadow': '-1px 0px 5px 0px rgba(167, 163, 163, 0.61)'
        }
      )),
      state('selected', style(
        {
          'transform': 'scale(1.1)',
          'box-shadow': '0px 0px 5px 0px rgba(167, 163, 163, 0.61)',
          'border-radius': '4px',
          'width': '190px',
          'height': '190px',
        }
      ),
      ),
      transition('normal => selected', animate(100)),
      transition('selected => normal', animate(100))
    ])
  ]
})
export class ActiveProjectsComponent implements OnInit,OnDestroy {
  @Output() navigateToProject: EventEmitter<number> = new EventEmitter<number>();
  projects$: Observable<ProjectModel[]>;
  state = 'normal'
  projects: ProjectModel[];
 length:number;
 projectSubscription:Subscription
  constructor(
    public projectManagementService: ActiveProjectsManagementService,
    private router: Router,
    private store: Store<AppState>
  ) {
  }

  // to navigate to add project wizard.
  addProject() {
    this.router.navigate(['/manage-rating-forms/create-project-wizard']);
  }

  ngOnDestroy(){
    this.projectSubscription.unsubscribe()
  }

  // to navigate to edit project wizard
  editProject(i) {
    this.projects$.subscribe(projects => {
      length = projects.length
    })
    this.router.navigate([`manage-rating-forms/edit-project-wizard/${length - i - 1}`]);
  }

  // to select the project
  selectProject(i: string): void {
    //this.projectManagementService.selectedProjectIndex.next(this.length - (+i) - 1);
    this.state === 'normal' ? this.state = 'selected' : this.state = 'normal';
    
   
    // this.projectManagementService.navigate(this.length - (+i) - 1, this.projects, this.navigateToProject);
    this.store.dispatch(new SelectProject(this.length - (+i) - 1));
  }

  ngOnInit(): void {
    this.projects$ = this.store.pipe(
      select(getAllProjects)
    );
    // this.selectProject()
     this.projectSubscription=this.projects$.subscribe(projects=>{
       if(projects){
         this.length = projects.length;     
         this.projects=projects;
         let index = this.projects.findIndex(project =>{
           return project.selected;
         });
         this.projectManagementService.navigate(this.length - (index) - 1, this.projects, this.navigateToProject);
         this.projectManagementService.selectedProjectIndex.next(this.projects[index].projectId);
       }
    })
  }
}
