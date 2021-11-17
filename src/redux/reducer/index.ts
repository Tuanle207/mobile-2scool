import { combineReducers } from "redux";
import { Criteria, Regulation } from "../../model/Mistake";
import { Token } from "../action/auth";
import auth, { initialToken } from "./auth"
import { initialCriteria } from "./criteria";
import mistake, { DcpReport, initialDcpReport } from "./mistake";
import criteria from "./criteria"
import regulation from './regulation'
import { initialRegulation } from "./regulation";
export interface RootState {
    auth: Token;
    mistake: DcpReport,
    criteria: Criteria[],
    regulation: Regulation[]
}

export const initialState: RootState = {
    auth: initialToken,
    mistake: initialDcpReport,
    criteria: initialCriteria,
    regulation: initialRegulation
}

const rootReducer = combineReducers({
    auth,
    mistake,
    criteria,
    regulation
});

export default rootReducer;