import * as actionTypes from './actions/directorActionTypes'
import {devConsoleLog, updateObject} from '../utils';

const initialState = {
  tournament: null,
  builder: null,
}

export const directorReducerInit = (initial = initialState) => initial;

export const directorReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.NEW_TOURNAMENT_INITIATED:
      return updateObject(state, {
        builder: {
          navigableSteps: ['name'],
          currentStep: 'name',
          tournament: null,
          saved: false,
        },
      });
    case actionTypes.NEW_TOURNAMENT_SAVED:
      return updateObject(state, {
        builder: updateObject( state.builder, {
          tournament: {...action.tournament},
          saved: true,
        })
      });
    case actionTypes.NEW_TOURNAMENT_STEP_COMPLETED:
      const newNavigableSteps = [...state.builder.navigableSteps];
      if (!newNavigableSteps.includes(action.nextStep)) {
        newNavigableSteps.push(action.nextStep);
      }
      return updateObject(state, {
        builder: updateObject(state.builder, {
          navigableSteps: newNavigableSteps,
          currentStep: action.nextStep,
        }),
      });
    case actionTypes.NEW_TOURNAMENT_PREVIOUS_STEP_CHOSEN:
      return updateObject(state, {
        builder: updateObject(state.builder, {
          currentStep: action.step,
        }),
      });
    case actionTypes.NEW_TOURNAMENT_COMPLETED:
      return updateObject(state, {
        builder: null,
        tournament: {...state.builder.tournament},
        tournaments: null,
      })
    default:
      return state;
  }
}
