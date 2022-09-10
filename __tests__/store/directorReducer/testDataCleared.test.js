import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";
import {TournamentRecord} from "../../../src/store/records/tournament";

describe ('action type: test data cleared', () => {
  const tournament = {
    id: 14,
    identifier: 'a-tournament',
    name: 'A Tournament',
    stripe_account: {
      money: 'lots',
      fees: 'low',
    },
    shifts: [
      {
        identifier: 'abc',
        requested_count: 12,
        confirmed_count: 26,
      },
    ],
    bowler_count: 16,
    team_count: 6,
    free_entry_count: 1,
  }

  const previousState = {
    tournament: TournamentRecord(tournament),
  }

  const changes = {
    bowler_count: 0,
    team_count: 0,
    free_entry_count: 0,
    shifts: [
      {
        identifier: 'abc',
        requested_count: 0,
        confirmed_count: 0,
      },
    ],
  }

  const action = {
    type: actionTypes.TEST_DATA_CLEARED,
  }

  const expected = TournamentRecord({
    ...tournament,
    ...changes,
  });

  it ('includes the tournament in the response', () => {
    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(result.tournament.toJS()).toStrictEqual(expected.toJS());
  });
});