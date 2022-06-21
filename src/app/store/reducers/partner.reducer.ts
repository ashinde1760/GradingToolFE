import { PartnerWithTrainingCenters, PartnerActionTypes, PartnerActions, TrainingCenterDetail } from "../actions/patner.actions";

export interface PartnerState {
    partner: PartnerWithTrainingCenters[];
    clientSponsorList:{firstName:string
    lastName:string
    centerId:string
    role:string
    phone:string
    userId:string
    email:string
    status:string}[],
    selectedPartnerTC: {
      "centerInchargeLastName": string,
      "centerInchargeFirstName": string,
      "district": string,
      "latitude": string,
      "centerInchargeContact":string,
      "centerInchargeEmail": string,
      "tcId": string,
      "tcName":string,
      "centerAddress": string,
      "centerInchargeId": string,
      "longitude":string
  }[],
    centerInChargeList:{firstName:string
      lastName:string
      centerId:string
      role:string
      phone:string
      userId:string
      email:string
      status:string}[]
  
  }
  
  const initialState: PartnerState = {
    partner: [],
    clientSponsorList:[],
    selectedPartnerTC:[],
    centerInChargeList:[]
  };
  
  export function partnerReducer(state: PartnerState = initialState, action: PartnerActionTypes
    ): PartnerState {
      switch (action.type) {
  
          case PartnerActions.ListPartnerFinished: 
            return {
              ...state,
              partner: [...action.payload],
            };
            
          case PartnerActions.ListofClientSponserFinished: 
            return {
              ...state,
              clientSponsorList: [...action.payload],
            };

          case PartnerActions.listofCenterInchargeFinished: 
            return {
              ...state,
              centerInChargeList: [...action.payload],
            };
          case PartnerActions.listofTrainigCenterFinished: 
            return {
              ...state,
              selectedPartnerTC: [...action.payload],
            };
          
            case PartnerActions.clearPartnersData:
              return initialState

            default: 
                return state;
              
        }
        
    }