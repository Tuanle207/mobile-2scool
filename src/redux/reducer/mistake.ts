import { AnyAction } from "redux";
import { initialState } from ".";
import { Student } from "../../model/Mistake";
import { ADD_CLASS_MISTAKE, ADD_MISTAKE } from "../type";
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

export const initialDcpReport: DcpReport = {
    dcpClassReports: []
}

const mistakeReducer = (state = initialDcpReport, action: AnyAction) => {
    const { type, payload } = action
    switch (type) {
        case ADD_MISTAKE: {
            // console.log(payload)
            // console.log(state)
        }
        case ADD_CLASS_MISTAKE: {
            console.log(payload)
            console.log(state)
            return payload
        }
        default: return state
    }
}

export default mistakeReducer