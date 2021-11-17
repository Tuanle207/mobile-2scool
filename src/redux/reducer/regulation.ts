import { AnyAction } from "redux";
import { Regulation } from "../../model/Mistake";
import { ADD_REGULATION } from "../type";

export const initialRegulation: Regulation[] = []
  
  const criteriaReducer = (state = initialRegulation, action: AnyAction) => {
    const { type, payload } = action
    switch (type) {
      case ADD_REGULATION: {
        return payload
      }
      default:
        return state;
    }
  }
  
  export default criteriaReducer