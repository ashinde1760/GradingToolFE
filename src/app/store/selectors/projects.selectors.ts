import { createSelector } from "@ngrx/store";
import { AppState } from "../index";
import { ProjectState } from '../reducers/project.reducer';

const projectState = (state: AppState) => state.projects;


export const getAllProjects = createSelector(
  projectState,
  (state) => state.projects
);



export const fetchProjectById = createSelector(
  projectState,
  (state, props) => {
    return state.projects.find(project => {
      return project.projectId === props.projectId;
    });
  }
);

export const fetchSurveyId = createSelector(
  projectState,
  (state: ProjectState, props) => {
    if (props.projectIndex !== undefined) {
      return state.projects[props.projectIndex].surveyId
    }
    return state.projects[state.projects.length - 1].surveyId
  }
)

export const getProjectByIndex = createSelector(
  projectState,
  (state: ProjectState, props) => {

    if (props.projectIndex !== undefined) {
      return state.projects[props.projectIndex];
    }

    return state.projects[state.projects.length - 1];
  }
);

export const getSelectedProject= createSelector(projectState,(projectState=>{
  return projectState.selectedProject
}))

