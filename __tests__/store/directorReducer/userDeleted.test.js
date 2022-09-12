import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: user deleted', () => {
  const user1 = {
    identifier: 'i-stick-around',
    first_name: 'Johnny',
    last_name: 'Rose',
  }

  const user2 = {
    identifier: 'i-am-doomed',
    first_name: 'David',
    last_name: 'Rose',
  }

  const user3 = {
    identifier: 'positively-bedeviled-with-meetings-etcetera',
    first_name: 'Moira',
    last_name: 'Rose',
  }

  const previousState = {
    tournament: {
      identifier: 'abcdefg',
      purchasable_items: [],
    },
    users: [
      user1,
      user2,
      user3,
    ],
  };

  const action = {
    type: actionTypes.USER_DELETED,
    user: user2,
  }

  const expected = {
    ...previousState,
    users: [
      user1,
      user3,
    ],
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});