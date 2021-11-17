import { Regulation } from "../../model/Mistake"


export function addRegulation(payload: Regulation[]) {
    return {
        type: 'ADD_REGULATION',
        payload: payload
    }
}