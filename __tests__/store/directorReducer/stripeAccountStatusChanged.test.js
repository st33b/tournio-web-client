import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";
import {TournamentRecord} from "../../../src/store/records/tournament";

describe('action type: stripe account status changed', () => {
  const previousState = {
    tournament: TournamentRecord({
      stripe_account: {
        can_accept_payments: 42,
      }
    }),
  };

  const action = {
    type: actionTypes.STRIPE_ACCOUNT_STATUS_CHANGED,
    accountStatus: {
      can_accept_payments: true,
    },
  }

  const expected = TournamentRecord({
    stripe_account: {
      can_accept_payments: true,
    }
  });

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(result.tournament).toStrictEqual(expected);
  });
});