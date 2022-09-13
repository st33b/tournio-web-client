import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: tournament deleted', () => {
  const t1 = {
    identifier: 'chocolate',
  }
  const t2 = {
    identifier: 'marshmallow',
  };

  const t3 = {
    identifier: 'graham',
  }
  const previousState = {
    tournament: {
      identifier: 'smores',
    },
    tournaments: [
      t1,
      t2,
      t3,
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
    type: actionTypes.TOURNAMENT_DELETED,
    tournament: t2,
  }

  const expected = {
    ...previousState,
    tournaments: [
      t1,
      t3,
    ],
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});