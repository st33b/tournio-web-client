import * as actionTypes from './actions/actionTypes';
import {updateObject} from "../utils";

const initialState = {
  tournament: null,
  team: null,
  // bowler: null,
}

export const initializer = (initialValue = initialState) => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem('tournament'));
  }
  return initialValue;
}

export const tournamentReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.TOURNAMENT_DETAILS_RETRIEVED:
      return updateObject(state, {
        tournament: action.tournament,
      });
    case actionTypes.TEAM_DETAILS_RETRIEVED:
      return updateObject(state, {
        team: action.team,
      });
    default:
      console.log("Nope!");
      break;
  }
}

