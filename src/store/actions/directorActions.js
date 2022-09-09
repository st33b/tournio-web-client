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
    newState: tournament.state,
    newStatus: tournament.status,
  }
}

export const tournamentTestEnvironmentUpdated = (testingEnvironment) => {
  return {
    type: actionTypes.TOURNAMENT_TEST_ENVIRONMENT_UPDATED,
    newRegistrationPeriod: testingEnvironment.settings.registration_period,
  }
}