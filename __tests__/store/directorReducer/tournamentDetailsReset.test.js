import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe ('action type: tournament details reset', () => {
  const previousState = {
    tournament: {
      identifier: 'go-away',
    },
    users: [
      {
        identifier: 'stick-around',
      },
      {
        identifier: 'friend-stay',
      },
    ],
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
    teams: [
      {
        identifier: 'group 1',
      },
      {
        identifier: 'group 2',
      },
    ],
    freeEntries: [
      {
        identifier: 'free_for_all',
      },
      {
        identifier: 'free_for_many',
      },
    ],
  }

  const action = {
    type: actionTypes.TOURNAMENT_DETAILS_RESET,
  }
  const expected = {
    ...previousState,
    tournament: null,
    bowlers: [],
    teams: [],
    freeEntries: [],
  }

  it ('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});