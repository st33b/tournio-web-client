import * as actionTypes from './actions/actionTypes';
import {updateObject} from "../utils";

const initialState = {
  team: null,
  bowler: null,
}

export const registrationReducerInit = (initial = initialState) => initial;

export const registrationReducer = (state, action) => {
  const compareBowlers = (left, right) => {
    return left.position - right.position;
  }

  switch (action.type) {
    case actionTypes.RESET:
      return registrationReducerInit();
    case actionTypes.NEW_TEAM_REGISTRATION_SAVED:
      return updateObject(state, {
        team: {
          ...action.team,
        },
      });
    case actionTypes.NEW_TEAM_BOWLER_INFO_ADDED:
      return updateObject(state, {
        team: {
          ...state.team,
          bowlers: state.team.bowlers.concat(action.bowler).sort(compareBowlers),
        },
      });
    case actionTypes.NEW_TEAM_DOUBLES_PARTNERS_SAVED:
      return updateObject(state, {
        team: {
          ...state.team,
          bowlers: [...action.bowlers],
        },
      });
    case actionTypes.NEW_TEAM_BOWLER_INFO_UPDATED:
      const updatedBowlers = [...state.team.bowlers];
      updatedBowlers[action.index] = action.bowler;
      return updateObject(state, {
        team: {
          ...state.team,
          bowlers: updatedBowlers,
        },
      });
    case actionTypes.NEW_TEAM_ENTRY_COMPLETED:
      return registrationReducerInit();
    case actionTypes.EXISTING_TEAM_BOWLER_INFO_ADDED:
      const bowler = {...action.bowler}
      return updateObject(state, {
        bowler: bowler,
      });
    case actionTypes.EXISTING_TEAM_BOWLER_SAVED:
      return updateObject(state, {
        team: action.team,
        bowler: null,
      });
    case actionTypes.NEW_SOLO_REGISTRATION_INITIATED:
      return updateObject(state, {
        bowler: {},
        team: null,
        bowlers: null,
        partner: null,
      });
    case actionTypes.SOLO_BOWLER_INFO_ADDED:
    case actionTypes.SOLO_BOWLER_INFO_UPDATED:
      const soloBowler = {...action.bowler};
      return updateObject(state, {
        bowler: soloBowler,
      });
    case actionTypes.SOLO_BOWLER_REGISTRATION_COMPLETED:
      return updateObject(state, {
        bowler: null,
      });
    default:
      console.log("Nope!");
      break;
  }
  return state;
}
