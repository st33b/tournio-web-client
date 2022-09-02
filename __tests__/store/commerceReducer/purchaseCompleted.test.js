import * as actionTypes from '../../../src/store/actions/actionTypes';
import {commerceReducer} from "../../../src/store/commerceReducer";

describe ('action type: purchase completed', () => {
  const newPaidPurchases = [
    {
      identifier: 'uno',
    },
    {
      identifier: 'dos',
    },
  ];

  const previousState = {
    cart: [
      {
        identifier: 'yeehaw',
      },
      {
        identifier: 'giddyup',
      },
    ],
    purchasedItems: [
      {
        identifier: 'eins',
      },
      {
        identifier: 'zwei',
      },
    ],
    availableItems: {
      foo: {
        identifier: 'foo',
      },
      bar: {
        identifier: 'bar',
      },
    },
  };

  const action = {
    type: actionTypes.PURCHASE_COMPLETED,
    newPaidPurchases: newPaidPurchases,
  }

  it ('empties out the cart', () => {
    const result = commerceReducer(previousState, action);
    expect(result.cart.length).toBe(0);
  });

  it ('adds the new paid purchases to purchasedItems', () => {
    const result = commerceReducer(previousState, action);
    expect(result.purchasedItems.length).toBe(previousState.purchasedItems.length + newPaidPurchases.length);
  });

  // seems a little sketchy, are we sure it should do this?
  it ('empties out availableItems', () => {
    const result = commerceReducer(previousState, action);
    expect(Object.keys(result.availableItems).length).toBe(0);
  });

  it ('nulls out the error', () => {
    const result = commerceReducer(previousState, action);
    expect(result.error).toBeNull();
  });
});