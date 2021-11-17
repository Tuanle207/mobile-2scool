import { Criteria } from "../../model/Mistake";

export function addCriteria(payload: Criteria[]) {
    return {
        type: 'ADD_CRITERIA',
        payload: payload
    }
}