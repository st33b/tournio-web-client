import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe ('action type: new tournament saved', () => {
  const previousState = {
    user: { identifier: '123' },
    tournament: null,
    tournaments: [
      { a: 1 },
      { b: 2 },
    ],
    builder: {
      navigableSteps: ['name'],
      currentStep: 'name',
      tournament: {
        name: 'Florida Associated Invitational National Tournament',
        year: 2023,
        abbreviation: 'FAINT',
      },
      saved: true,
    },
  };

  const action = {
    type: actionTypes.NEW_TOURNAMENT_STEP_COMPLETED,
    completedStep: 'name',
    nextStep: 'details',
  }
  const expected = {
    ...previousState,
    builder: {
      ...previousState.builder,
      navigableSteps: ['name', 'details'],
      currentStep: 'details',
    }
  }

  it ('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});