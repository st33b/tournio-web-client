import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe ('action type: user list retrieved', () => {
  const previousState = {
    tournament: {
      identifier: 'go-away',
    },
    users: null,
  }
  const users = [
    {
      identifier: 'stick-around',
    },
    {
      identifier: 'friend-stay',
    },
  ];

  const action = {
    type: actionTypes.USER_LIST_RETRIEVED,
    users: users,
  }
  const expected = {
    ...previousState,
    users: users,
  }

  it ('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});