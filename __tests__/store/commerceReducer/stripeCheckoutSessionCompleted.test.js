import * as actionTypes from '../../../src/store/actions/actionTypes';
import {commerceReducer} from "../../../src/store/commerceReducer";

describe ('action type: stripe checkout session completed', () => {
  const previousState = {
    cart: [
      {
        identifier: 'an-object',
      },
    ],
    bowler: {
      identifier: '23045890ldf',
    },
    checkoutSessionId: 'session-id',
  };
  const action = {
    type: actionTypes.STRIPE_CHECKOUT_SESSION_COMPLETED,
  };

  it ('nulls the session id', () => {
    const result = commerceReducer(previousState, action);
    expect(result.checkoutSessionId).toBeNull();
  });

  it ('empties the cart', () => {
    const result = commerceReducer(previousState, action);
    expect(result.cart.length).toBe(0);
  });

  it ('nulls out the bowler', () => {
    const result = commerceReducer(previousState, action);
    expect(result.bowler).toBeNull();
  })
});