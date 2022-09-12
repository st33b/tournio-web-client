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
    type: actionTypes.PURCHASABLE_ITEM_ADDED,
    items: items,
  }
}

export const purchasableItemUpdated = (item) => {
  return {
    type: actionTypes.PURCHASABLE_ITEM_UPDATED,
    item: item,
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