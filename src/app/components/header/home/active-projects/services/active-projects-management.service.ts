import {EventEmitter, Injectable} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ProjectModel } from 'src/app/store/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ActiveProjectsManagementService {
  selectedProjectIndex=new BehaviorSubject<string>(null);
  navigate(i: number, projects: ProjectModel[], navigateToProject?: EventEmitter<number>): void {
  navigateToProject = navigateToProject ? navigateToProject : new EventEmitter<number>();
  navigateToProject.emit(i);
  }

  constructor() {
  }
}
