import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";
import {TournamentRecord} from "../../../src/store/records/tournament";

describe('action type: tournament shift deleted', () => {
  const fellowship = {
    identifier: 'fellowship',
    name: 'The Fellowship of the Ring',
  }
  const twoTowers = {
    identifier: 'two-towers',
    name: 'The Two Towers',
  }
  const kingsReturn = {
    identifier: 'return-of-the-king',
    name: 'The Return of the King',
  }
  const previousState = {
    tournament: TournamentRecord({
      identifier: 'abcdefg',
      shifts: [
        fellowship,
        twoTowers,
        kingsReturn,
      ],
    }),
  };

  const shift = {
    ...twoTowers,
    description: 'The middle part of a trilogy',
    capacity: 99,
    display_order: 2,
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
    type: actionTypes.TOURNAMENT_SHIFT_DELETED,
    shift: shift,
  }

  const expected = TournamentRecord({
    identifier: previousState.tournament.identifier,
    shifts: [
      fellowship,
      kingsReturn,
    ],
  });

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(expected.toJS()).toEqual(result.tournament.toJS());
  });
});