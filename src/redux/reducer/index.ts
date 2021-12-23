import { combineReducers } from "redux";
import { Criteria, Regulation } from "../../model/Mistake";
import { Token } from "../action/auth";
import auth, { initialToken } from "./auth"
import { initialCriteria } from "./criteria";
import mistake, { DcpReport, initialDcpReport } from "./mistake";
import criteria from "./criteria"
import regulation from './regulation'
import mistakeHistory,{initialDcpHistoryReport} from "./mistakeHistory";
import { initialRegulation } from "./regulation";
import { RoleUser } from "../action/roleUser";
import { initialRoleUser } from "./roleUser";
import roleUser from './roleUser';
export interface RootState {
    auth: Token;
    mistake: DcpReport,
    criteria: Criteria[],
    regulation: Regulation[]
    mistakeHistory:DcpReport,
    roleUser:RoleUser
}

export const initialState: RootState = {
    auth: initialToken,
    mistake: initialDcpReport,
    criteria: initialCriteria,
    regulation: initialRegulation,
    mistakeHistory:initialDcpHistoryReport,
    roleUser:initialRoleUser

}

const rootReducer = combineReducers({
    auth,
    mistake,
    criteria,
    regulation,
    mistakeHistory,
    roleUser,
});

export default rootReducer;