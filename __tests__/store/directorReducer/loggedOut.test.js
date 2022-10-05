import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: logged out', () => {
  const previousState = {
    tournament: {
      foo: 'bar',
    },
    tournaments: [
      {
        foo: 'bar',
      },
    ],
    user: {
      email: 'sauron@mordor.co.uk',
      authToken: 'the-great-eye-is-ever-watchful',
    },
  };

  const action = {
    type: actionTypes.LOGGED_OUT,
  }

  const expected = {
    user: null,
    tournaments: null,
    tournament: null,
    builder: null,

    users: [],
    bowlers: [],
    teams: [],
    freeEntries: [],
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});