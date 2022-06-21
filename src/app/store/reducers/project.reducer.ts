import {ProjectModel} from '../models/project.model';
import {ProjectActions, ProjectActionTypes} from '../actions/project.actions';

export interface ProjectState {
  projects: ProjectModel[];
  selectedProject:string;
}

export const initialState: ProjectState = {
  projects: null,
  selectedProject:null
};

export function projectReducer(state: ProjectState = initialState, actions: ProjectActionTypes): ProjectState {
  switch (actions.type) {
    case ProjectActions.FetchProjectsEnd: {
      return {
        ...state,
        projects: actions.payload,
      };
    }

    case ProjectActions.SelectProject: {
      const modifiedProjects = state.projects.map((project, index) => {
        if (+actions.payload === index) {

          return new ProjectModel(
            project.projectId,
            project.surveyId,
            project.title,
            project.description,
            project.startDate,
            project.endDate,
            project.selfAssesmentDeadLine,
            true);
        } else {
          return new ProjectModel(
            project.projectId,
            project.surveyId,
            project.title,
            project.description,
            project.startDate,
            project.endDate,
            project.selfAssesmentDeadLine,
            false);
        }
      });

      return {
        ...state,
        projects: modifiedProjects,
      };
    }
    case ProjectActions.UpdateProjectEnd: {
      const projectId = actions.payload.projectId;
      const projectData = actions.payload.projectData;
      const modifiedProjects = [...state.projects];
      const index = state.projects.findIndex((project => {
        return project.projectId === projectId;
      }));
      const targetProject = state.projects[index];
      modifiedProjects[index] = new ProjectModel(
        targetProject.projectId,
        targetProject.surveyId,
        projectData.projectName,
        projectData.projectDescription,
        projectData.startDate,
        projectData.endDate,
        projectData.selfAssignmentDeadLine
      );
      return {
        ...state,
        projects: modifiedProjects,
        selectedProject:targetProject.projectId
      };
    }
    case ProjectActions.CreateProjectEnd: {
      // const projectsCopy = state.projects.concat()
      // projectsCopy.push(actions.payload)
      return {
        ...state,
        projects: [...actions.payload],
        selectedProject:actions.projectId

      }
    }
    case ProjectActions.DeleteProjectEnd: {
      const updatedProjects = state.projects.filter(project => {
        return project.projectId !== actions.payload;
      });
      return {
        ...state,
        projects: updatedProjects,
      };
    }

    default: {
      return state;
    }
  }
}
