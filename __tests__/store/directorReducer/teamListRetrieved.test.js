import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe ('action type: team list retrieved', () => {
  const previousState = {
    tournament: {
      identifier: 'go-away',
    },
  }

  const teams = [
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
    type: actionTypes.TEAM_LIST_RETRIEVED,
    teams: teams,
  }
  const expected = {
    ...previousState,
    teams: teams,
  }

  it ('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});