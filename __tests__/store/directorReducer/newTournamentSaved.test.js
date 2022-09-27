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
      completedSteps: ['name'],
      currentStep: 'name',
      tournament: {},
      saved: false,
    },
  };

  const newTournament = {
    name: 'Florida Associated Invitational National Tournament',
    year: 2023,
    abbreviation: 'FAINT',
  }

  const action = {
    type: actionTypes.NEW_TOURNAMENT_INITIATED,
  }
  const expected = {
    ...previousState,
    builder: {
      completedSteps: ['name'],
      currentStep: 'details',
      tournament: {...newTournament},
      saved: true,
    }
  }

  it ('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});