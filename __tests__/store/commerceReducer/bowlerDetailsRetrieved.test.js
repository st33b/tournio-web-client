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
  const unpaidNonLedgerItems = [
    {
      name: 'a flag',
      category: 'identity',
    },
  ];
  const unpaidLedgerItems = [
    {
      name: 'entry fee',
      category: 'ledger',
    },
  ];
  const tournament = {
    name: 'Bowl-a-rama',
    date: '2023-01-01',
  };
  const actionBowler = {
    // these are expected to be there
    has_free_entry: false,
    paid_purchases: paidPurchases,
    unpaid_purchases: unpaidLedgerItems.concat(unpaidNonLedgerItems),
    tournament: tournament,

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
      name: 'shirt',
    },
    {
      id: 2,
      name: 'shoes',
    },
    {
      id: 3,
      name: 'service',
    },
  ];
  const action = {
    type: actionTypes.BOWLER_DETAILS_RETRIEVED,
    bowler: actionBowler,
    availableItems: availableItems,
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
  it ('includes an error property in the return', () => {
    const result = commerceReducer({}, action);
    expect(result.error).toBeDefined();
  });

  //
  // Nulled-out properties
  //
  it ('nulls the freeEntry property in the return', () => {
    const result = commerceReducer({}, action);
    expect(result.freeEntry).toBeNull();
  });
  it ('nulls the error property in the return', () => {
    const result = commerceReducer({}, action);
    expect(result.error).toBeNull();
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
    expect(result.cart).toStrictEqual(unpaidLedgerItems.concat(unpaidNonLedgerItems));
  });
  it ('populates the tournament property', () => {
    const result = commerceReducer({}, action);
    expect(result.tournament).toStrictEqual(tournament);
  })

  //
  // Making changes to the action's contents
  //
  describe ('the bowler has no unpaid items', () => {
    it ('includes an initialized cart in the returned object', () => {
      const myAction = {...action};
      myAction.bowler = {...actionBowler}
      myAction.bowler.unpaid_purchases = [];
      const result = commerceReducer({}, myAction);
      expect(result.cart).toStrictEqual([]);
    });
  });

  describe ('the bowler has a free entry', () => {
    it ('includes only non-ledger items in the cart', () => {
      const myAction = {...action};
      myAction.bowler = {...actionBowler}
      myAction.bowler.has_free_entry = true;
      const result = commerceReducer({}, myAction);
      expect(result.cart).toStrictEqual(unpaidNonLedgerItems);
    });
  });
});