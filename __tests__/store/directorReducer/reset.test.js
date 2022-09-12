import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

import {List} from "immutable";

describe ('action type: reset', () => {
  const action = {
    type: actionTypes.RESET,
  }
  const expected = {
    tournament: null,
    users: [],
    tournaments: [],
    bowlers: [],
  }

  it ('returns the expected object', () => {
    const result = directorReducer({}, action);
    expect(result).toStrictEqual(expected);
  });
});