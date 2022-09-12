import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: bowler deleted', () => {
  const bowler1 = {
    identifier: 'i-stick-around',
    first_name: 'Johnny',
    last_name: 'Rose',
  }

  const bowler2 = {
    identifier: 'i-am-doomed',
    first_name: 'David',
    last_name: 'Rose',
  }

  const bowler3 = {
    identifier: 'positively-bedeviled-with-meetings-etcetera',
    first_name: 'Moira',
    last_name: 'Rose',
  }

  const previousState = {
    tournament: {
      identifier: 'abcdefg',
      purchasable_items: [],
    },
    bowlers: [
      bowler1,
      bowler2,
      bowler3,
    ],
  };

  const action = {
    type: actionTypes.BOWLER_DELETED,
    bowler: bowler2,
  }

  const expected = {
    ...previousState,
    bowlers: [
      bowler1,
      bowler3,
    ],
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});