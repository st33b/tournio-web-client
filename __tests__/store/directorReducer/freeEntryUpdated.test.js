import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: free entry updated', () => {
  const existingFreeEntry = {
    identifier: 'the-more-things-change',
    code: 'abc',
  }

  const previousState = {
    tournament: {
      identifier: 'abcdefg',
      purchasable_items: [],
    },
    freeEntries: [
      existingFreeEntry,
    ],
  }

  const changedFreeEntry = {
    ...existingFreeEntry,
    code: '123',
  }

  const action = {
    type: actionTypes.FREE_ENTRY_UPDATED,
    freeEntry: changedFreeEntry,
  }

  const expected = {
    ...previousState,
    freeEntries: [
      changedFreeEntry,
    ],
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});