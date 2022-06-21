import { UserActions, UserActionTypes, UpdateStatusEnds, FailedUploadData, RemoveUserRow } from './../actions/user.action';
import { User } from "../models/user";

export interface UserState {
  users: User[];
  error:string;
  success:string;
  failedUploadData: FailedUploadData;
  underProcess: boolean;
}

const initialState: UserState = {
  users: null,
  error: '',
  success: '',
  failedUploadData: { failedRecords: [], totalRecordsProcessed: 0,  failedRecordCount: 0},
  underProcess: false
};

export function userReducer(state: UserState = initialState, action: UserActionTypes
): UserState {
  switch (action.type) {
    case UserActions.ListUserFinished: {
      return {
        ...state,
        users: action.payload,
      };
    }

    case UserActions.FilterUserEnds: {
      return {
        ...state,
        users: action.payload,
      };
    }


    case UserActions.DeleteUserEnds: {
      const updatedUsers = state.users.filter(user => {
        return user.userId !== action.payload.userId;
      });
      return {
        ...state,
        users: updatedUsers,
        success: action.payload.success,
        error:null
      };
    }
    case UserActions.AddEmptyRow: {
      return {
        ...state,
        users: [action.payload,...state.users],
      };
    }

    case UserActions.AddUserEnds:{
      const usersCopy = state.users.concat()
      usersCopy.splice(0,1);
      usersCopy.push(action.payload.user);
      return {
        ...state,
        users: usersCopy,
        success: action.payload.success,
        error:null,
      };
    }

    case UserActions.AddMultipleUsersStarts:{
      return {
        ...state,
        underProcess: true
      }
    }

    case UserActions.AddMultipleUsersEnds:{
      const usersCopy = state.users.concat();
      return {
        ...state,
        users: usersCopy,
        underProcess: false
      };
    }

    case UserActions.AddUserFails:{
      const usersCopy = state.users.concat()
      usersCopy.splice(0,1);
      // usersCopy.push(action.payload);
      return {
        ...state,
        users: usersCopy,
        error:action.payload,
        success:null
      };
    }

    case UserActions.AddMultipleUsersFails:{
      const usersCopy = state.users.concat()
      // usersCopy.splice(0,1);
      // usersCopy.push(action.payload);
      return {
        ...state,
        users: usersCopy,
        error:action.payload,
        success:null
      };
    }


    case UserActions.DeleteUserFails:{
      const usersCopy = state.users.concat()
      // usersCopy.splice(0,1);
      return {
        ...state,
        users: usersCopy,
        error:action.payload,
        success:null
      };
    }

      case UserActions.UpdateUserEnds:{
        return {
          ...state,
          users: state.users.map(user =>{
            if(user.userId === action.payload.user.userId){
              return {...user, ...action.payload.user}
            }
            return user
          }),
          success: action.payload.success,
          error:null
        };
      }


      case UserActions.UpdateStatusEnd:{
        const userId = action.payload.userId;
        const status = action.payload.status;
        const modifiedUsers = [...state.users];
        const index = state.users.findIndex((user => {
          return user.userId === userId;
        }));
        modifiedUsers[index] = new User(
          modifiedUsers[index].firstName,
          modifiedUsers[index].lastName,
          modifiedUsers[index].phone,
          modifiedUsers[index].email,
          modifiedUsers[index].role,
          status,
         userId
        );
        return {
          ...state,
          users: modifiedUsers,
          success: null,
          error:null
        };
      }

      case UserActions.UploadDataFails:{
        return {
          ...state,
          failedUploadData: action.payload.failedUploadData
        }
      } 

      case UserActions.ResetFailedUploadedData: {
        return {
          ...state,
          failedUploadData: { failedRecords: [], totalRecordsProcessed: 0,  failedRecordCount: 0}
        }
      }

      case UserActions.RemoveUserRow: {
        let newUserArray = [...state.users];
        newUserArray.shift();
        return {
          ...state,
          users: newUserArray
        }
      }

    default:
      return state;
  }
}
