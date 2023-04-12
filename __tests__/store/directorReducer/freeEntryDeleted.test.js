import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: free entry deleted', () => {
  const freeEntry1 = {
    identifier: 'i-stick-around',
  }

  const freeEntry2 = {
    identifier: 'i-am-doomed',
  }

  const freeEntry3 = {
    identifier: 'positively-bedeviled-with-meetings-etcetera',
  }

  const previousState = {
    tournament: {
      identifier: 'abcdefg',
      free_entry_count: 42,
    },
    freeEntries: [],
  };

  const action = {
    type: actionTypes.FREE_ENTRY_DELETED,
    freeEntry: freeEntry2,
  }

  const expected = {
    tournament: {
      ...previousState.tournament,
      free_entry_count: previousState.tournament.free_entry_count - 1,
    },
    freeEntries: [],
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});
