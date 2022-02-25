import * as actionTypes from './actions/actionTypes';
import {updateObject} from "../utils";

const initialState = {
  tournament: null,
  teamName: null,
  bowlers: [],
  team: null,
}

export const initializer = (initialValue = initialState) => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem('registration'));
  }
  return initialValue;
}

export const registrationReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.TOURNAMENT_DETAILS_RETRIEVED:
      return updateObject(state, {
        tournament: action.tournament,
      });
    case actionTypes.NEW_TEAM_REGISTRATION_INITIATED:
      return updateObject(state, {
        teamName: null,
        bowlers: [],
        team: null,
      });
    case actionTypes.TEAM_INFO_ADDED:
      return updateObject(state, {
        teamName: action.teamName
      });
    case actionTypes.NEW_TEAM_BOWLER_INFO_ADDED:
      const newBowler = {...action.bowler}
      return updateObject(state, {
        bowlers: state.bowlers.concat(newBowler),
      });
    case actionTypes.NEW_TEAM_PARTNERS_SELECTED:
      return updateObject(state, {
        bowlers: action.bowlers.slice(0),
      });
    case actionTypes.NEW_TEAM_BOWLER_UPDATED:
      const updatedBowlers = state.bowlers.slice(0);
      const bowlerIndex = action.bowler.position - 1;
      updatedBowlers[bowlerIndex] = updateObject(state.bowlers[bowlerIndex], action.bowler);
      return updateObject(state, {
        bowlers: updatedBowlers,
      });
    case actionTypes.NEW_TEAM_ENTRY_COMPLETED:
      return updateObject(state, {
        teamName: null,
        bowlers: [],
      });
    case actionTypes.JOIN_TEAM_REGISTRATION_INITIATED:
      return updateObject(state, {
        team: null,
        teamName: null,
        bowlers: [],
      });
    case actionTypes.TEAM_DETAILS_RETRIEVED:
      return updateObject(state, {
        team: action.team,
        teamName: action.team.name,
        bowlers: action.team.bowlers,
      });
    case actionTypes.EXISTING_TEAM_BOWLER_INFO_ADDED:
      return updateObject(state, {
        bowlers: state.bowlers.concat(action.bowler),
      });
    case actionTypes.EXISTING_TEAM_BOWLER_EDITED:
      const bowlers = state.bowlers.slice(0);
      bowlers.pop(); // remove the last bowler, which is the one who's been edited
      bowlers.push(action.bowler);
      return updateObject(state,{
        bowlers: bowlers,
      });
    case actionTypes.SUBMIT_JOIN_TEAM_COMPLETED:
      return updateObject(state, {
        team: null,
        teamName: null,
        bowlers: [],
      });
    default:
      console.log("Nope!");
      break;
  }
}

