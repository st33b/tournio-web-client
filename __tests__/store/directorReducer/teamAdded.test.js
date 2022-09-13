import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: team added', () => {
  const previousState = {
    tournament: {
      identifier: 'abcdefg',
      purchasable_items: [],
      team_count: 17,
    },
    teams: [],
  };

  const newTeam = {
    identifier: 'something-you-can-buy',
    name: 'Reyna Terror',
  };

  const action = {
    type: actionTypes.TEAM_ADDED,
    team: newTeam,
  }

  const expected = {
    ...previousState,
    tournament: {
      ...previousState.tournament,
      team_count: previousState.tournament.team_count + 1,
    },
    teams: [newTeam],
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});