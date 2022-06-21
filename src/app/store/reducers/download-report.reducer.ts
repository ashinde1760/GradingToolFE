import { DownloadReportActionTypes, DownloadReportActions } from './../actions/download-report.actions';
import { DownloadReportRequest } from "../actions/download-report.actions";

export interface DownloadReportState {
    downloadReport: string;
  }
  
  const initialState: DownloadReportState = {
    downloadReport: null
  };

  export function downloadReportReducer(state: DownloadReportState = initialState, action: DownloadReportActionTypes
    ): DownloadReportState {
      switch (action.type) {
        case DownloadReportActions.DownloadReportFinished: 
          return {
            ...state,
            downloadReport: action.payload,
          };
          default: 
                return state;
        }
    }
    