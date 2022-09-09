import * as actionTypes from './directorActionTypes';

export const reset = () => {
  return {
    type: actionTypes.RESET,
  }
}

export const stripeAccountStatusChanged = (accountStatus) => {
  return {
    type: actionTypes.STRIPE_ACCOUNT_STATUS_CHANGED,
    accountStatus: accountStatus,
  }
}

export const tournamentDetailsRetrieved = (tournament) => {
  return {
    type: actionTypes.TOURNAMENT_DETAILS_RETRIEVED,
    tournament: tournament,
  }
}

export const tournamentStateChanged = (tournament) => {
  return {
    type: actionTypes.TOURNAMENT_STATE_CHANGED,
    identifier: tournament.identifier,
    newState: tournament.state,
    newStatus: tournament.status,
  }
}