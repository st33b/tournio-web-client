import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe ('action type: tournament details retrieved', () => {
  const previousState = {};
  const tournament = {
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

  it ('includes the tournament in the response', () => {
    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(result.tournament).toStrictEqual(tournament);
  });
});