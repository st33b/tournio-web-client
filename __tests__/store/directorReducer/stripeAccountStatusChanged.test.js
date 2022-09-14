import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: stripe account status changed', () => {
  const previousState = {
    tournament: {
      stripe_account: null,
    },
  };

  const newAccount = {
    identifier: 'a09f8gaod9fgui',
    can_accept_payments: true,
  }

  const action = {
    type: actionTypes.STRIPE_ACCOUNT_STATUS_CHANGED,
    stripeAccount: newAccount,
  }

  const expected = {
    tournament: {
      stripe_account: newAccount,
    },
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});