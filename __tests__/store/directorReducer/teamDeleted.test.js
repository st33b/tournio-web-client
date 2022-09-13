import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: team deleted', () => {
  const team1 = {
    identifier: 'i-stick-around',
  }

  const team2 = {
    identifier: 'i-am-doomed',
  }

  const team3 = {
    identifier: 'positively-bedeviled-with-meetings-etcetera',
  }

  const previousState = {
    tournament: {
      identifier: 'abcdefg',
      team_count: 42,
    },
    teams: [
      team1,
      team2,
      team3,
    ],
  };

  const action = {
    type: actionTypes.TEAM_DELETED,
    team: team2,
  }

  const expected = {
    tournament: {
      ...previousState.tournament,
      team_count: previousState.tournament.team_count - 1,
    },
    teams: [
      team1,
      team3,
    ],
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});