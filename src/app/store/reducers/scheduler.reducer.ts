import { SchedulerActionTypes, Scheduler, ListSchedulerFinished, SchedulerActions } from './../actions/scheduler.actions';
export interface SchedulerState {
    scheduler: Scheduler[];
    error:string;
    success:string;
  }
  
  const initialState: SchedulerState = {
    scheduler: null,
    error: '',
    success: ''
  };
  
  export function schedulerReducer(state: SchedulerState = initialState, action: SchedulerActionTypes
  ): SchedulerState {
    switch (action.type) {
      case SchedulerActions.ListSchedulerFinished: {
        return {
          ...state,
          scheduler: action.payload,
        };
      }
      case SchedulerActions.FilterByEnds: 
            return {
              ...state,
              scheduler: action.payload,
            };
      default:
      return state;
    }
}