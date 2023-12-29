import * as actionTypes from '../../../src/store/actions/actionTypes';
import {commerceReducer} from "../../../src/store/commerceReducer";

describe ('action type: bowler details retrieved', () => {
  const paidPurchases = [
    {
      name: 'ticket',
    },
    {
      name: 'silly hat',
    }
  ];
  const actionBowler = {
    identifier: 'blah-blah-blah',

    // these are things added just for the fun of testing
    name: 'Captain Marvel',
    average: 300,
    usbc_id: '1-1',
    powers: [
      'flight',
      'indestructible',
      'photon beam',
      'strong',
      'glows',
      "puts up with men's shit",
    ],
  };
  const availableItems = [
    {
      id: 1,
      identifier: 'foo',
      name: 'shirt',
    },
    {
      id: 2,
      identifier: 'bar',
      name: 'shoes',
    },
    {
      id: 3,
      identifier: 'bubba',
      name: 'service',
    },
  ];
  const automaticItems = [
    {
      identifier: 'probably-an-entry-fee',
      value: 109,
      name: 'The most likely thing',
    }
  ]
  const availableApparelItems = []
  const action = {
    type: actionTypes.COMMERCE_SESSION_INITIATED,
    bowler: actionBowler,
    availableItems: availableItems,
    purchases: paidPurchases,
    automaticItems: automaticItems,
    freeEntry: null,
  }

  //
  // Presence of properties
  //
  it ('includes a bowler property in the return', () => {
    const result = commerceReducer({}, action);
    expect(result.bowler).toBeDefined();
  });
  it ('includes an availableItems property in the return', () => {
    const result = commerceReducer({}, action);
    expect(result.availableItems).toBeDefined();
  });
  it ('includes a cart property in the return', () => {
    const result = commerceReducer({}, action);
    expect(result.cart).toBeDefined();
  });
  it ('includes a purchasedItems property in the return', () => {
    const result = commerceReducer({}, action);
    expect(result.purchasedItems).toBeDefined();
  });
  it ('includes a freeEntry property in the return', () => {
    const result = commerceReducer({}, action);
    expect(result.freeEntry).toBeDefined();
  });

  //
  // Objects in the response
  //
  it ('includes the retrieved bowler in the returned object', () => {
    const result = commerceReducer({}, action);
    expect(result.bowler).toStrictEqual(actionBowler);
  });
  it ('includes available items in the returned object', () => {
    const result = commerceReducer({}, action);
    expect(result.availableItems).toStrictEqual(availableItems);
  });
  it ('includes purchased items in the returned object', () => {
    const result = commerceReducer({}, action);
    expect(result.purchasedItems).toStrictEqual(paidPurchases);
  });
  it ('includes all unpaid items in the cart', () => {
    const result = commerceReducer({}, action);
    expect(result.cart).toStrictEqual(automaticItems);
  });

  describe ('the bowler has a free entry', () => {
    it ('includes only non-ledger items in the cart', () => {
      const myAction = {...action};
      myAction.bowler = {...actionBowler}
      myAction.freeEntry = {
        blah: 'blah',
        uniqueCode: 'uh-huh',
      };
      const result = commerceReducer({}, myAction);
      expect(result.cart).toStrictEqual([]);
    });
  });
});
