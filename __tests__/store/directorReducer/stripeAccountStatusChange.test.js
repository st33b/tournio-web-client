import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe ('action type: stripe account status change', () => {
  const previousState = {
    tournament: {
      stripe_account: {
        can_accept_payments: 42,
      }
    }
  }

  const actionPayload = {
    can_accept_payments: true,
  }

  const action = {
    type: actionTypes.STRIPE_ACCOUNT_STATUS_CHANGE,
    accountStatus: actionPayload,
  }

  const expected = {
    tournament: {
      stripe_account: {
        can_accept_payments: true,
      }
    }
  }

  it ('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});