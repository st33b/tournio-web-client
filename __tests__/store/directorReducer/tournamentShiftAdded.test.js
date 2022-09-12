import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: tournament shift added', () => {
  const previousState = {
    tournament: {
      identifier: 'abcdefg',
      shifts: [],
    },
  };

  const newShift = {
    identifier: 'forty-two',
    name: 'Early',
    description: 'Well, it happens in the wee hours of the morning...',
    capacity: 99,
    display_order: 1,
    requested_count: 0,
    confirmed_count: 0,
    events: null,
    registration_types: {
      new_team: true,
      solo: true,
      join_team: true,
      partner: false,
      new_pair: false,
    }
  }

  const action = {
    type: actionTypes.TOURNAMENT_SHIFT_ADDED,
    shift: newShift,
  }

  const expected = {
    tournament: {
      identifier: previousState.tournament.identifier,
      shifts: [newShift],
    },
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(result).toStrictEqual(expected);
  });
});