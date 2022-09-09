import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";
import {TournamentRecord} from "../../../src/store/records/tournament";

describe ('action type: reset', () => {
  const action = {
    type: actionTypes.RESET,
  }
  const expected = {
    tournament: TournamentRecord(),
  }

  it ('returns the expected object', () => {
    const result = directorReducer({}, action);
    expect(result).toStrictEqual(expected);
  });
});