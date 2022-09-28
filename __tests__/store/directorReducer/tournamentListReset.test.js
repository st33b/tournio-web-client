import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

import {List} from "immutable";

describe ('action type: tournament list reset', () => {
  const previousState = {
    tournament: {
      identifier: 'smores',
    },
    tournaments: [
      {
        identifier: 'chocolate',
      },
      {
        identifier: 'marshmallow',
      },
      {
        identifier: 'graham',
      },
    ],
    users: [
      {
        identifier: 'wayne',
      },
      {
        identifier: 'garth',
      },
    ]
  }
  const action = {
    type: actionTypes.TOURNAMENT_LIST_RESET,
  }
  const expected = {
    ...previousState,
    tournaments: null,
  }

  it ('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});