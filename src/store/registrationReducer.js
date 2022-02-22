import * as actionTypes from './actions/actionTypes';
import {updateObject} from "../utils";



const registrationReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.TEAM_INFO_ADDED:
      return updateObject(state, {
        teamName: action.teamName
      });
    default:
      console.log("Nope!");
      break;
  }
}

export default registrationReducer;