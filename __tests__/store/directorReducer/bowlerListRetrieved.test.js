import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe ('action type: bowler list retrieved', () => {
  const previousState = {
    tournament: {
      identifier: 'go-away',
    },
    bowlers: [
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
    ],
  }

  const action = {
    type: actionTypes.BOWLER_LIST_RESET,
  }
  const expected = {
    ...previousState,
    bowlers: [],
  }

  it ('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});