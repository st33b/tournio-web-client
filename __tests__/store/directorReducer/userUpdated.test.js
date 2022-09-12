import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: user updated', () => {
  const existingUser = {
    identifier: 'the-more-things-change',
    first_name: 'The More',
    last_name: 'They Stay The Same',
  }

  const previousState = {
    tournament: {
      identifier: 'abcdefg',
      purchasable_items: [],
    },
    users: [
      existingUser,
    ],
  }

  const changedUser = {
    ...existingUser,
    last_name: 'They, Uhh, Change!',
  }

  const action = {
    type: actionTypes.USER_UPDATED,
    user: changedUser,
  }

  const expected = {
    ...previousState,
    users: [
      changedUser,
    ],
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});