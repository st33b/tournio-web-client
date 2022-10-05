import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe ('action type: new tournament previous step chosen', () => {
  const previousState = {
    user: { identifier: '123' },
    tournament: null,
    tournaments: [
      { a: 1 },
      { b: 2 },
    ],
    builder: {
      navigableSteps: ['name', 'details', 'dates'],
      currentStep: 'dates',
      tournament: {
        name: 'Florida Associated Invitational National Tournament',
        year: 2023,
        abbreviation: 'FAINT',
      },
      saved: true,
    },
  };

  const action = {
    type: actionTypes.NEW_TOURNAMENT_PREVIOUS_STEP_CHOSEN,
    step: 'name',
  }
  const expected = {
    ...previousState,
    builder: {
      ...previousState.builder,
      currentStep: 'name',
    }
  }

  it ('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});