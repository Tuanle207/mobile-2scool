import { AnyAction } from "redux"
import { Criteria } from "../../model/Mistake"
import { ADD_CRITERIA } from "../type"

export const initialCriteria: Criteria[] = []
  
  const criteriaReducer = (state = initialCriteria, action: AnyAction) => {
    const { type, payload } = action
    switch (type) {
      case ADD_CRITERIA: {
        return payload
      }
      default:
        return state;
    }
  }
  
  export default criteriaReducer