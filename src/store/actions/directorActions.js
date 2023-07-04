import * as actionTypes from './directorActionTypes';

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
