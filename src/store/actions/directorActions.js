import * as actionTypes from './directorActionTypes';

export const tournamentListReset = () => {
  return {
    type: actionTypes.TOURNAMENT_LIST_RESET,
  }
}

export const stripeAccountStatusChanged = (account) => {
  return {
    type: actionTypes.STRIPE_ACCOUNT_STATUS_CHANGED,
    stripeAccount: account,
  }
}

export const tournamentListRetrieved = (tournaments) => {
  return {
    type: actionTypes.TOURNAMENT_LIST_RETRIEVED,
    tournaments: tournaments,
  }
}

export const tournamentDetailsReset = () => {
  return {
    type: actionTypes.TOURNAMENT_DETAILS_RESET,
  }
}

export const tournamentDetailsRetrieved = (tournament) => {
  return {
    type: actionTypes.TOURNAMENT_DETAILS_RETRIEVED,
    tournament: tournament,
  }
}

export const tournamentDeleted = (tournament) => {
  return {
    type: actionTypes.TOURNAMENT_DELETED,
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

export const tournamentConfigItemChanged = (configItem) => {
  return {
    type: actionTypes.TOURNAMENT_CONFIG_ITEM_UPDATED,
    configItem: configItem,
  }
}

export const tournamentShiftAdded = (newShift) => {
  return {
    type: actionTypes.TOURNAMENT_SHIFT_ADDED,
    shift: newShift,
  }
}

export const tournamentShiftDeleted = (shift) => {
  return {
    type: actionTypes.TOURNAMENT_SHIFT_DELETED,
    shift: shift,
  }
}

export const tournamentShiftUpdated = (shift) => {
  return {
    type: actionTypes.TOURNAMENT_SHIFT_UPDATED,
    shift: shift,
  }
}

export const additionalQuestionsUpdated = (tournament) => {
  return {
    type: actionTypes.ADDITIONAL_QUESTIONS_UPDATED,
    questions: tournament.additional_questions,
    availableQuestions: tournament.available_questions,
  }
}

export const testDataCleared = () => {
  return {
    type: actionTypes.TEST_DATA_CLEARED,
  }
}

export const purchasableItemsAdded = (items) => {
  return {
    type: actionTypes.PURCHASABLE_ITEMS_ADDED,
    items: items,
  }
}

export const purchasableItemUpdated = (item) => {
  return {
    type: actionTypes.PURCHASABLE_ITEM_UPDATED,
    item: item,
  }
}

export const sizedItemUpdated = (item) => {
  return {
    type: actionTypes.SIZED_ITEM_UPDATED,
    sizedItem: item,
  }
}

export const purchasableItemDeleted = (item) => {
  return {
    type: actionTypes.PURCHASABLE_ITEM_DELETED,
    item: item,
  }
}

export const logoImageUploaded = (imageUrl) => {
  return {
    type: actionTypes.LOGO_IMAGE_UPLOADED,
    imageUrl: imageUrl,
  }
}

export const tournamentContactAdded = (contact) => {
  return {
    type: actionTypes.TOURNAMENT_CONTACT_ADDED,
    contact: contact,
  }
}

export const tournamentContactUpdated = (contact) => {
  return {
    type: actionTypes.TOURNAMENT_CONTACT_UPDATED,
    contact: contact,
  }
}

export const userListRetrieved = (users) => {
  return {
    type: actionTypes.USER_LIST_RETRIEVED,
    users: users,
  }
}

export const userAdded = (user) => {
  return {
    type: actionTypes.USER_ADDED,
    user: user,
  }
}

export const userUpdated = (user) => {
  return {
    type: actionTypes.USER_UPDATED,
    user: user,
  }
}

export const userDeleted = (user) => {
  return {
    type: actionTypes.USER_DELETED,
    user: user,
  }
}

export const bowlerListRetrieved = (bowlers) => {
  return {
    type: actionTypes.BOWLER_LIST_RETRIEVED,
    bowlers: bowlers,
  }
}

export const bowlerUpdated = (bowler) => {
  return {
    type: actionTypes.BOWLER_UPDATED,
    bowler: bowler,
  }
}

export const bowlerDeleted = (bowler) => {
  return {
    type: actionTypes.BOWLER_DELETED,
    bowler: bowler,
  }
}

export const bowlerListReset = () => {
  return {
    type: actionTypes.BOWLER_LIST_RESET,
  }
}

export const teamListRetrieved = (teams) => {
  return {
    type: actionTypes.TEAM_LIST_RETRIEVED,
    teams: teams,
  }
}

export const teamUpdated = (team) => {
  return {
    type: actionTypes.TEAM_UPDATED,
    team: team,
  }
}

export const teamDeleted = (team) => {
  return {
    type: actionTypes.TEAM_DELETED,
    team: team,
  }
}

export const teamListReset = () => {
  return {
    type: actionTypes.TEAM_LIST_RESET,
  }
}

export const teamAdded = (team) => {
  return {
    type: actionTypes.TEAM_ADDED,
    team: team,
  }
}

export const freeEntryListRetrieved = (freeEntries) => {
  return {
    type: actionTypes.FREE_ENTRY_LIST_RETRIEVED,
    freeEntries: freeEntries,
  }
}

export const freeEntryUpdated = (freeEntry) => {
  return {
    type: actionTypes.FREE_ENTRY_UPDATED,
    freeEntry: freeEntry,
  }
}

export const freeEntryDeleted = (freeEntry) => {
  return {
    type: actionTypes.FREE_ENTRY_DELETED,
    freeEntry: freeEntry,
  }
}

export const freeEntryAdded = (freeEntry) => {
  return {
    type: actionTypes.FREE_ENTRY_ADDED,
    freeEntry: freeEntry,
  }
}

export const loggedIn = (user, authToken) => {
  return {
    type: actionTypes.LOGGED_IN,
    user: user,
    authToken: authToken,
  }
}

export const loggedOut = () => {
  return {
    type: actionTypes.LOGGED_OUT,
  }
}

export const newTournamentInitiated = () => {
  return {
    type: actionTypes.NEW_TOURNAMENT_INITIATED,
  }
}

export const newTournamentSaved = (tournament) => {
  return {
    type: actionTypes.NEW_TOURNAMENT_SAVED,
    tournament: tournament,
  }
}

export const newTournamentPreviousStepChosen = (chosenStep) => {
  return {
    type: actionTypes.NEW_TOURNAMENT_PREVIOUS_STEP_CHOSEN,
    step: chosenStep,
  }
}

export const newTournamentStepCompleted = (completedStep, nextStep) => {
  return {
    type: actionTypes.NEW_TOURNAMENT_STEP_COMPLETED,
    completedStep: completedStep,
    nextStep: nextStep,
  }
}

export const newTournamentCompleted = () => {
  return {
    type: actionTypes.NEW_TOURNAMENT_COMPLETED,
  }
}
