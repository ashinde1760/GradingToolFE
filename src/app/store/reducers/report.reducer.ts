import { Action } from '@ngrx/store';
import { IPartnerReport } from '../../util/partnerReportDataUtil';
import { IProjectReport } from '../../util/projectReportDataUtil';
import { ITrainingCenterReport } from '../../util/trainingCenterReportDataUtil';
import { ReportActions, ReportActionTypes } from '../actions/report.actions';

export interface ReportState {
    partnerReport: IPartnerReport,
    projectReport: IProjectReport,
    triningCenterReport: ITrainingCenterReport
}

const initialState: ReportState = {
    partnerReport: null,
    projectReport: null,
    triningCenterReport: null
};

export function reportReducer(state: ReportState = initialState, action: ReportActionTypes): ReportState{
    switch (action.type) {
        case ReportActions.FetchPartnerReportEnd : {
           return {
                ...state,
                partnerReport: { ...action.payload }
           };
        }

        case ReportActions.FetchProjectReportEnd : {
            return {
                 ...state,
                 projectReport: { ...action.payload }
            };
         }

         case ReportActions.FetchTrainingCenterReportEnd : {
            return {
                 ...state,
                 triningCenterReport: { ...action.payload }
            };
         }

         case ReportActions.ReportActionFails: {
             return {
                 ...state,
                 triningCenterReport: null,
                 partnerReport: null,
                 projectReport: null
             }
         }

         default:
            return state;
    }
}