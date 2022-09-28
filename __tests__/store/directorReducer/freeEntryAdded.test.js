import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: free entry added', () => {
  const previousState = {
    tournament: {
      identifier: 'abcdefg',
      purchasable_items: [],
      team_count: 17,
      free_entry_count: 3,
    },
    teams: [],
    freeEntries: [],
  };

  const newFreeEntry = {
    identifier: 'something-you-can-buy',
    name: 'Reyna Terror',
  };

  const action = {
    type: actionTypes.FREE_ENTRY_ADDED,
    freeEntry: newFreeEntry,
  }

  const expected = {
    ...previousState,
    tournament: {
      ...previousState.tournament,
      free_entry_count: previousState.tournament.free_entry_count + 1,
    },
    freeEntries: [newFreeEntry],
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});