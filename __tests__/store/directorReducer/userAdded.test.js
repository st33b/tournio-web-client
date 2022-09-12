import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: user added', () => {
  const previousState = {
    tournament: {
      identifier: 'abcdefg',
      purchasable_items: [],
    },
    users: [],
  };

  const newUser = {
    identifier: 'something-you-can-buy',
    email: 'electronic@letter.usps',
  };

  const action = {
    type: actionTypes.USER_ADDED,
    user: newUser,
  }

  const expected = {
    ...previousState,
    users: [newUser],
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});