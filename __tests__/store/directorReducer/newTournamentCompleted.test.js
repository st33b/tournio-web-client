import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe ('action type: new tournament completed', () => {
  const newTournament = {
    name: 'Florida Associated Invitational National Tournament',
    year: 2023,
    abbreviation: 'FAINT',
  }

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
      tournament: newTournament,
      saved: false,
    },
  };

  const action = {
    type: actionTypes.NEW_TOURNAMENT_COMPLETED,
  }
  const expected = {
    ...previousState,
    tournament: newTournament,
    tournaments: null,
    builder: null,
  }

  it ('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});