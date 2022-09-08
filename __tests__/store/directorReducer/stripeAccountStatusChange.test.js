import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe ('action type: stripe account status change', () => {
  const action = {
    type: actionTypes.STR,
  }
  const expected = {
    tournament: null,
  }

  it ('returns the expected object', () => {
    const result = directorReducer({}, action);
    expect(result).toStrictEqual(expected);
  });
});