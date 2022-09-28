import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe ('action type: free entry list retrieved', () => {
  const previousState = {
    tournament: {
      identifier: 'go-away',
    },
  }

  const freeEntries = [
    {
      identifier: 'benny',
    },
    {
      identifier: 'björn',
    },
    {
      identifier: 'agnetha',
    },
    {
      identifier: 'anni-frid',
    },
  ];

  const action = {
    type: actionTypes.FREE_ENTRY_LIST_RETRIEVED,
    freeEntries: freeEntries,
  }
  const expected = {
    ...previousState,
    freeEntries: freeEntries,
  }

  it ('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});