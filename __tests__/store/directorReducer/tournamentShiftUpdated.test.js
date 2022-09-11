import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";
import {TournamentRecord} from "../../../src/store/records/tournament";

describe('action type: tournament shift updated', () => {
  const fellowship = {
    identifier: 'fellowship',
    name: 'The Fellowship of the Ring',
    capacity: 9,
  }
  const twoTowers = {
    identifier: 'two-towers',
    name: 'The Two Towers',
    capacity: 10000,
  }
  const kingsReturn = {
    identifier: 'return-of-the-king',
    name: 'The Return of the King',
    capacity: 100000,
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

  const updatedShift = {
    identifier: 'two-towers',
    capacity: 9999,
  }

  const action = {
    type: actionTypes.TOURNAMENT_SHIFT_UPDATED,
    shift: updatedShift,
  }

  const expected = TournamentRecord({
    identifier: previousState.tournament.identifier,
    shifts: [
      fellowship,
      {...twoTowers, ...updatedShift},
      kingsReturn,
    ],
  });

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(expected.toJS()).toEqual(result.tournament.toJS());
  });
});