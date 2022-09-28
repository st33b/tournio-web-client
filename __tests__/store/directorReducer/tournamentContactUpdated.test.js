import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: tournament contact updated', () => {
  const contact1 = {
    identifier: 'yippie-yay',
    name: 'Helpful Person',
    role: 'director',
  }
  const contact2 = {
    identifier: 'hoodie-hoo',
    name: 'Disengaged Person',
    role: 'treasurer',
  }

  const previousState = {
    tournament: {
      identifier: 'abcdefg',
      contacts: [
        contact1,
        contact2,
      ],
    },
  };

  const changedContact = {
    ...contact2,
    name: 'Engaged Person',
  }

  const action = {
    type: actionTypes.TOURNAMENT_CONTACT_UPDATED,
    contact: changedContact,
  }

  const expected = {
    tournament: {
      identifier: previousState.tournament.identifier,
      contacts: [
        contact1,
        changedContact,
      ],
    },
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(result).toStrictEqual(expected);
  });
});