import * as actionTypes from '../../../src/store/actions/actionTypes';
import {commerceReducer} from "../../../src/store/commerceReducer";

describe ('action type: stripe checkout session initiated', () => {
  const previousState = {};
  const action = {
    type: actionTypes.STRIPE_CHECKOUT_SESSION_INITIATED,
    sessionId: 'this-is-a-stripe-checkout-session',
  };

  it ('includes the session id', () => {
    const result = commerceReducer(previousState, action);
    expect(result.checkoutSessionId).toStrictEqual(action.sessionId);
  });
});