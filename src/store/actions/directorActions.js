import * as actionTypes from './directorActionTypes';

export const reset = () => {
  return {
    type: actionTypes.RESET,
  }
}

export const stripeAccountStatusChange = (accountStatus) => {
  return {
    type: actionTypes.STRIPE_ACCOUNT_STATUS_CHANGE,
    accountStatus: accountStatus,
  }
}

export const tournamentDetailsRetrieved = (tournament) => {
  return {
    type: actionTypes.TOURNAMENT_DETAILS_RETRIEVED,
    tournament: tournament,
  }
}