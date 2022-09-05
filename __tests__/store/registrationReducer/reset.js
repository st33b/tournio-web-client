import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: reset', () => {
  const action = {
    type: actionTypes.RESET,
  }
  const expected = {
    tournament: null,
    team: null,
    bowler: null,
    bowlers: null,
    partner: null,
  }

  it ('returns the expected object', () => {
    const result = registrationReducer({}, action);
    expect(result).toStrictEqual(expected);
  });
});