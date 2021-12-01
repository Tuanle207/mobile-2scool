import { AnyAction } from "redux";
import { initialState } from ".";
import { Student } from "../../model/Mistake";
import { ADD_MISTAKE_HISTORY, ADD_MISTAKE } from "../type";
export interface DcpReport {
    dcpClassReports: DcpClassesReport[]
}

export interface DcpClassesReport {
    classId: string,
    faults: Faults[]
}

export interface Faults {
    regulationId: string,
    relatedStudentIds: Student[],
}

export const initialDcpHistoryReport: DcpReport = {
    dcpClassReports: []
}

const mistakeHistoryReducer = (state = initialDcpHistoryReport, action: AnyAction) => {
    const { type, payload } = action
    switch (type) {
        case ADD_MISTAKE: {
            // console.log(payload)
            // console.log(state)
        }
        case ADD_MISTAKE_HISTORY: {
            return payload
        }
        default: return state
    }
}

export default mistakeHistoryReducer