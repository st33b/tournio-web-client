import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";
import {TournamentRecord} from "../../../src/store/records/tournament";

describe('action type: tournament contact added', () => {
  const previousState = {
    tournament: TournamentRecord({
      identifier: 'abcdefg',
      contacts: [],
    }),
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

  const expected = TournamentRecord({
    identifier: previousState.tournament.identifier,
    contacts: [newContact],
  });

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(expected.toJS()).toEqual(result.tournament.toJS());
  });
});