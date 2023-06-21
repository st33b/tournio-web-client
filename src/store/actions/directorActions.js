import * as actionTypes from './directorActionTypes';

export const stripeAccountStatusChanged = (account) => {
  return {
    type: actionTypes.STRIPE_ACCOUNT_STATUS_CHANGED,
    stripeAccount: account,
  }
}

export const tournamentDetailsRetrieved = (tournament) => {
  return {
    type: actionTypes.TOURNAMENT_DETAILS_RETRIEVED,
    tournament: tournament,
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

export const additionalQuestionAdded = (question) => {
  return {
    type: actionTypes.ADDITIONAL_QUESTION_ADDED,
    question: question,
  }
}

export const additionalQuestionUpdated = (question) => {
  return {
    type: actionTypes.ADDITIONAL_QUESTION_UPDATED,
    question: question,
  }
}

export const additionalQuestionDeleted = (question) => {
  return {
    type: actionTypes.ADDITIONAL_QUESTION_DELETED,
    question: question,
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
