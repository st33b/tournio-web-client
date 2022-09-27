import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe ('action type: new tournament initiated', () => {
  const previousState = {
    user: { identifier: '123' },
    tournament: null,
    tournaments: [
      { a: 1 },
      { b: 2 },
    ],
    builder: null,
  };

  const action = {
    type: actionTypes.NEW_TOURNAMENT_INITIATED,
  }
  const expected = {
    ...previousState,
    builder: {
      completedSteps: [],
      currentStep: 'name',
      tournament: null,
      saved: false,
    }
  }

  it ('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});