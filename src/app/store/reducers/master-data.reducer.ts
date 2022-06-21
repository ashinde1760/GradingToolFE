import { MasterDataActions, AddIndividualEnd, MasterDataActionTypes, FailedUploadData } from './../actions/master-data.action';
import { PartnerPayloadType } from "../actions/master-data.action";
import { dataObject } from 'src/app/util/masterDataUtil';

export interface MasterDataState {
    masterData: dataObject[];
    error:string;
    success:string;
    failedUploadData: FailedUploadData;
    inProcess: boolean;
  }
  
  const initialState: MasterDataState = {
    masterData: [],
    error: '',
    success: '',
    failedUploadData: { failureRecords: [], totalRecord: 0,  failuresRecordsCount: 0},
    inProcess: false
  };
  
  export function masterDataReducer(state: MasterDataState = initialState, action: MasterDataActionTypes
  ): MasterDataState {
    switch (action.type) {
      case MasterDataActions.AddIndividualEnd: 
      
        return {
          ...state,
          success: action.payload.success
        };

        case MasterDataActions.ListMasterDataFinished: 
          return {
            ...state,
            masterData: action.payload,
          };

        case MasterDataActions.clearMasterData:{
            return {
              ...initialState,
              inProcess: state.inProcess
            }
          }

        case MasterDataActions.AddMultipleStarts:{
          return {
            ...state,
            inProcess: true
          }
        }


        case MasterDataActions.AddMultipleEnds:{
          return {
            ...state,
            inProcess: false
          }
        }    

        //   case MasterDataActions.AddEmptyRowForMasterData: 
        //     return {
        //       ...state,
        //       masterData: [action.payload,...state.masterData],
        //     };
          

        //   case MasterDataActions.DeleteFails:{
        //     const masterDataCopy = state.masterData.concat()
        //     // usersCopy.splice(0,1);
        //     return {
        //       ...state,
        //       masterData: masterDataCopy,
        //       error:action.payload,
        //       success:null
        //     };
        //   }

          case MasterDataActions.DeleteEnds: {
            const updatedMaster = state.masterData.filter(masterData => {
              // action.payload.deleteEntries.forEach(element => {
              //   if(masterData.projectMappingId !== element){
              //     return true;
              //   }
              // });
              return !action.payload.deleteEntries.includes(masterData.projectMappingId);
            });
            return {
              ...state,
              masterData: updatedMaster,
              success: action.payload.success,
              error:null
            };
          }

          case MasterDataActions.FilterEnds: 
            return {
              ...state,
              masterData: action.payload,
            };

            case MasterDataActions.UpdateIndividualEnd:{
              return {
                ...state,
                success: action.payload.success,
                error:null
              };
            }

        case MasterDataActions.UploadDataFails:{
          return {
            ...state,
            failedUploadData: action.payload.failedUploadData
          }
        }  

        case MasterDataActions.ResetFailedUploadedData: {
          return {
            ...state,
            failedUploadData: { failureRecords: [], totalRecord: 0,  failuresRecordsCount: 0}
          }
        }
        
        default:
            return state;
    }
}