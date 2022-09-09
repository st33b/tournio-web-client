import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";
import {TournamentRecord} from "../../../src/store/records/tournament";

describe ('action type: tournament details retrieved', () => {
  const previousState = {
    tournament: TournamentRecord(),
  };
  const tournament = {
    id: 14,
    identifier: 'a-tournament',
    name: 'A Tournament',
    stripe_account: {
      money: 'lots',
      fees: 'low',
    }
  }
  const action = {
    type: actionTypes.TOURNAMENT_DETAILS_RETRIEVED,
    tournament: tournament,
  }
  const expected = TournamentRecord(tournament);

  it ('includes the tournament in the response', () => {
    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(result.tournament).toStrictEqual(expected);
  });
});