import * as actionTypes from './actions/actionTypes';
import {updateObject} from "../utils";



const registrationReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.TEAM_INFO_ADDED:
      return updateObject(state, {
        teamName: action.teamName
      });
    case actionTypes.NEW_TEAM_BOWLER_INFO_ADDED:
      const newBowler = {...action.bowler}
      return updateObject(state, {
        bowlers: state.bowlers.concat(newBowler),
      })
    default:
      console.log("Nope!");
      break;
  }
}

export default registrationReducer;