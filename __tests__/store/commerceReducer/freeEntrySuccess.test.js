import * as actionTypes from '../../../src/store/actions/actionTypes';
import {commerceReducer} from "../../../src/store/commerceReducer";

describe ('action type: free entry success', () => {
  const previousState = {
    cart: [],
  };

  const action = {
    type: actionTypes.FREE_ENTRY_SUCCESS,
    code: 'free-yourself',
    message: 'yeah yeah we got it',
  };

  it ('includes the code and message in the free entry', () => {
    const result = commerceReducer(previousState, action);
    expect(result.freeEntry.code).toStrictEqual(action.code);
    expect(result.freeEntry.message).toStrictEqual(action.message);
  });

  describe ('when the cart has a ledger item', () => {
    const myPreviousState = {
      ...previousState,
      cart: [
        {
          identifier: 'shoop',
          category: 'ledger',
        },
        {
          identifier: 'doop',
          category: 'bowling',
        },
      ],
    };

    it ('removes the ledger item from the cart', () => {
      const result = commerceReducer(myPreviousState, action);
      const remainingLedgerItems = result.cart.some(item => item.category === 'ledger');
      expect(remainingLedgerItems).toBeFalsy();
    });
  });
});