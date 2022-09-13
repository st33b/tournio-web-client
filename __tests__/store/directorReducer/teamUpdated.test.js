import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: team updated', () => {
  const existingTeam = {
    identifier: 'the-more-things-change',
    name: 'Strikes and Spares',
  }

  const previousState = {
    tournament: {
      identifier: 'abcdefg',
      purchasable_items: [],
    },
    teams: [
      existingTeam,
    ],
  }

  const changedTeam = {
    ...existingTeam,
    name: 'Nope, Just Strikes',
  }

  const action = {
    type: actionTypes.TEAM_UPDATED,
    team: changedTeam,
  }

  const expected = {
    ...previousState,
    teams: [
      changedTeam,
    ],
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});