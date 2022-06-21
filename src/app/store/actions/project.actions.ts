import {Action} from '@ngrx/store';
import {ProjectModel} from '../models/project.model';

export enum ProjectActions {
  FetchProjectsStart = '[Project] Fetch Projects Start',
  FetchProjectsEnd = '[Project] Fetch Projects End',

  SelectProject = '[Project] Select project',

  CreateProjectStart = '[Project] Create Project Start',
  CreateProjectEnd = '[Project] Create Project End',

  UpdateProjectStart = '[Project] Update Project Start',
  UpdateProjectEnd = '[Project] Update Project End',

  DeleteProjectStart = '[Project] Delete Project Start',
  DeleteProjectEnd = '[Project] Delete Project End',

  ProjectActionFails = '[Project] Action fails'
}

export interface CreateProjectPayloadType {
  projectName: string,
  projectDescription: string,
  startDate: string,
  endDate: string
  selfAssignmentDeadLine: string
}

export interface UpdateProjectPayloadType {
  "projectName": string,
  "projectDescription": string,
  "startDate": string,
  "endDate": string,
  "selfAssignmentDeadLine": string
}

export class FetchProjectsStart implements Action {
  readonly type = ProjectActions.FetchProjectsStart;
}

export class FetchProjectsEnd implements Action {
  readonly type = ProjectActions.FetchProjectsEnd;

  constructor(public payload: ProjectModel[]) {
  }
}

export class SelectProject implements Action {
  readonly type = ProjectActions.SelectProject;

  constructor(public payload: number) {
  }
}


export class CreateProjectStart implements Action {
  readonly type = ProjectActions.CreateProjectStart;

  constructor(public payload: CreateProjectPayloadType) {
  }
}

export class CreateProjectEnd implements Action {
  readonly type = ProjectActions.CreateProjectEnd;

  constructor(public payload: ProjectModel[],public projectId:string) {
  }
}

export class UpdateProjectStart implements Action {
  readonly type = ProjectActions.UpdateProjectStart;

  constructor(public payload: { projectId: string, projectData: UpdateProjectPayloadType }) {
  }
}

export class UpdateProjectEnd implements Action {
  readonly type = ProjectActions.UpdateProjectEnd;

  constructor(public payload: {
    projectId: string,
    projectData: {
      projectName: string,
      projectDescription: string,
      startDate: string,
      endDate: string,
      selfAssignmentDeadLine: string
    }}) {
  }
}

export class DeleteProjectStart implements Action {
  readonly type = ProjectActions.DeleteProjectStart;

  constructor(public payload: string) {
  }
}

export class DeleteProjectEnd implements Action {
  readonly type = ProjectActions.DeleteProjectEnd;

  constructor(public payload: string) {
  }
}

export class ProjectActionFails implements Action{
  readonly type = ProjectActions.ProjectActionFails;
  constructor(){}
}

export type ProjectActionTypes =
  FetchProjectsStart
  | FetchProjectsEnd
  | SelectProject
  | CreateProjectStart
  | CreateProjectEnd
  | UpdateProjectStart
  | UpdateProjectEnd
  | DeleteProjectStart
  | DeleteProjectEnd
  | ProjectActionFails;
