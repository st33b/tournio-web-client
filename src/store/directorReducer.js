import * as actionTypes from './actions/directorActionTypes'
import {updateObject} from '../utils';
import {TournamentRecord} from "./records/tournament";

const initialState = {
  tournament: TournamentRecord(),
}

export const directorReducerInit = (initial = initialState) => initial;

export const directorReducer = (state, action) => {
  if (process.env.NODE_ENV === 'development') {
    // Maybe keep these, and always log reducer actions if we're in the development environment?
    console.log("Director reducer existing state:", state);
    console.log("Director reducer action:", action);
  }

  switch (action.type) {
    case actionTypes.RESET:
      return directorReducerInit();
    case actionTypes.TOURNAMENT_DETAILS_RETRIEVED:
      return updateObject(state, {
        tournament: TournamentRecord(action.tournament),
      });
    case actionTypes.STRIPE_ACCOUNT_STATUS_CHANGED:
      const stripeAccount = state.tournament.stripe_account;
      stripeAccount.can_accept_payments = action.accountStatus.can_accept_payments;
      return updateObject(state, {
        tournament: state.tournament.set('stripe_account', stripeAccount),
      });
    case actionTypes.TOURNAMENT_STATE_CHANGED:
      const newStatus = {
        state: action.newState,
        status: action.newStatus,
      }
      return updateObject(state, {
        tournament: state.tournament.merge(newStatus),
      });
    default:
      return state;
  }
}