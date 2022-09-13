import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: bowler updated', () => {
  const existingBowler = {
    identifier: 'the-more-things-change',
    first_name: 'The More',
    last_name: 'They Stay The Same',
  }

  const previousState = {
    tournament: {
      identifier: 'abcdefg',
      purchasable_items: [],
    },
    bowlers: [
      existingBowler,
    ],
  }

  const changedBowler = {
    ...existingBowler,
    last_name: 'They, Uhh, Change!',
  }

  const action = {
    type: actionTypes.BOWLER_UPDATED,
    bowler: changedBowler,
  }

  const expected = {
    ...previousState,
    bowlers: [
      changedBowler,
    ],
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});