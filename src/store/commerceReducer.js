import * as actionTypes from './actions/actionTypes';
import {updateObject} from "../utils";

const initialState = {
  tournament: null,
  bowler: null,
  chosenItems: [],
  availableItems: {},
  purchasedItems: [],
}

export const comInitializer = (initialValue = initialState) => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem('commerce'));
  }
  return initialValue;
}

export const commerceReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.TOURNAMENT_DETAILS_RETRIEVED:
      return updateObject(state, {
        tournament: action.tournament,
        bowler: null,
      });
    case actionTypes.TEAM_DETAILS_RETRIEVED:
      return updateObject(state, {
        bowler: null,
      })
    case actionTypes.BOWLER_DETAILS_RETRIEVED:
      return updateObject(state, {
        bowler: action.bowler,
        availableItems: action.availableItems,
      });
    default:
      console.log('Haha, no');
      break;
  }
}