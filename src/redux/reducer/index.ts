import { initialWindowMetrics } from "react-native-safe-area-context";
import { combineReducers } from "redux";
import { Token } from "../action/auth";
import auth, { initialToken } from "./auth"
export interface RootState {
    auth: Token;
}

export const initialState: RootState = {
    auth: initialToken
}

const rootReducer = combineReducers({
    auth,
  });

  export default rootReducer;