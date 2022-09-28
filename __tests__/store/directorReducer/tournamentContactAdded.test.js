import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: tournament contact added', () => {
  const previousState = {
    tournament: {
      identifier: 'abcdefg',
      contacts: [],
    },
  };

  const newContact = {
    identifier: 'yippie-yay',
    name: 'Helpful Person',
    role: 'director',
  }

  const action = {
    type: actionTypes.TOURNAMENT_CONTACT_ADDED,
    contact: newContact,
  }

  const expected = {
    tournament: {
      identifier: previousState.tournament.identifier,
      contacts: [newContact],
    },
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(result).toStrictEqual(expected);
  });
});