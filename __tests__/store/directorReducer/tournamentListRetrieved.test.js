import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe ('action type: tournament list retrieved', () => {
  const previousState = {
    tournament: null,
    users: [],
    tournaments: [],
  }
  const tournaments = [
    {
      identifier: 'classic',
    },
    {
      identifier: 'invitational',
    },
    {
      identifier: 'scratch',
    },
    {
      identifier: 'handicap',
    },
  ];

  const action = {
    type: actionTypes.TOURNAMENT_LIST_RETRIEVED,
    tournaments: tournaments,
  }
  const expected = {
    ...previousState,
    tournaments: tournaments,
  }

  it ('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});