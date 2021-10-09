import { AnyAction } from "redux";
import { initialState } from ".";
import { Token } from "../action/auth";
import { LOGIN_SUCCESS } from "../type";

type ActionType = {
  type: string
  payload: any
};

export const initialToken: Token = {
  access_token: "",
  refresh_token: "",
  token_type: ""
}

const authReducer = (state = initialState, action: AnyAction) => {
  const { type, payload } = action
  switch (type) {
    case LOGIN_SUCCESS: {
      return payload
    }
    default:
      return state;
  }
}

export default authReducer