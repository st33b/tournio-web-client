import * as actionTypes from './actions/directorActionTypes'
import {updateObject} from '../utils';

const initialState = {
  tournament: null,
}

export const directorReducerInit = (initial = initialState) => initial;

export const directorReducer = (state, action) => {
  // Maybe keep these, and always log reducer actions if we're in the development environment?
  console.log("Director reducer existing state:", state);
  console.log("Director reducer action:", action);

  switch (action.type) {
    case actionTypes.RESET:
      return directorReducerInit();
    case actionTypes.STRIPE_ACCOUNT_STATUS_CHANGE:
      const newTournament = {...state.tournament};
      newTournament.stripe_account = {...state.tournament.stripe_account};
      newTournament.stripe_account.can_accept_payments = action.accountStatus.can_accept_payments;
      return updateObject(state, {
        tournament: newTournament,
      });
    case actionTypes.TOURNAMENT_DETAILS_RETRIEVED:
      return updateObject(state, {
        tournament: {...action.tournament},
      });
    default:
      return state;
  }
}