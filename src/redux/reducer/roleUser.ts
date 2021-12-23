import { AnyAction } from "redux";
import { Regulation } from "../../model/Mistake";
import { ROLE_USER_LOGIN } from "../type";

import { RoleUser } from "../action/roleUser";
export const initialRoleUser: RoleUser = {
    CreateNewDcpReport:false,
    CreateNewLRReport:false,
  }
  const roleUserReducer = (state = initialRoleUser, action: AnyAction) => {
    const { type, payload } = action
    switch (type) {
      case ROLE_USER_LOGIN: {
        return payload
      }
      default:
        return state;
    }
  }
  
  export default roleUserReducer