import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: tournament details retrieved', () => {
  const previousState = {};
  const tournament = {
    identifier: 'a-tournament',
    name: 'A Tournament',
  }
  const action = {
    type: actionTypes.TOURNAMENT_DETAILS_RETRIEVED,
    tournament: tournament,
  }

  it ('includes the tournament in the response', () => {
    const result = registrationReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(result.tournament).toStrictEqual(tournament);
  });
});