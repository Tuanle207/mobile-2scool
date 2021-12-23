import { ROLE_USER_LOGIN } from "../type"

export type RoleUser = {
    CreateNewDcpReport : boolean,
    CreateNewLRReport : boolean, 

}

export function checkRoleUser (payload: RoleUser) {
    return {
        type: ROLE_USER_LOGIN,
        payload: payload
    }
}