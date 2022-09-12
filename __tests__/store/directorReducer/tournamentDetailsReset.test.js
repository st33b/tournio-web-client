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
  }

  const action = {
    type: actionTypes.TOURNAMENT_DETAILS_RESET,
  }
  const expected = {
    ...previousState,
    tournament: null,
  }

  it ('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});