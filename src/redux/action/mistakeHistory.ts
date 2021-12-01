import { DcpReport, Faults } from "../reducer/mistake"

export function addClassMistakeHistory (payload: DcpReport) {
    return {
        type: 'ADD_MISTAKE_HISTORY',
        payload: payload
    }
}