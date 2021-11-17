import { DcpReport, Faults } from "../reducer/mistake"

export function addClassMistake (payload: DcpReport) {
    return {
        type: 'ADD_CLASS_MISTAKE',
        payload: payload
    }
}