import { ClassDetail } from "./Class";

export interface Criteria {
    name: string,
    id: string
}

export interface Regulation {
    name: string | null
    point: number
    id: string
    criteriaId: string
    criteria: Criteria
}

export interface Student {
    class: ClassDetail
    classId: string
    dob: string,
    id: string,
    name: string,
    parentPhoneNumber: string
}
