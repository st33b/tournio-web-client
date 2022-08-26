import * as actionTypes from '../../../src/store/actions/actionTypes';
import {commerceReducer} from "../../../src/store/commerceReducer";

describe('item added to cart', () => {
  // Prerequisites:
  // state:
  //  - cart is defined, and contains a list of added items, possibly empty. Each cart item includes a quantity
  //  - availableItems is a map of identifier to item details, possibly empty
  //  - purchasedItems is a list of items, possibly empty -- passed as a function arg when item.determination is 'event'
  //  - tournament -- passed as a function arg when item.determination is 'event'
  // item:
  //  - includes the quantity already present in the cart (?)

  const action = {
    type: actionTypes.ITEM_ADDED_TO_CART,
    item: {},
  }

  const previousState = {
    cart: [],
    availableItems: {},
    purchasedItems: [],
  }

  it ('works', () => {
    const result = commerceReducer(previousState, action);
    expect(result.cart.length).toStrictEqual(1);
  });

  // item added to cart has the correct quantity
  it ('adds a quantity of 1', () => {
    const result = commerceReducer(previousState, action);
    const resultItem = result.cart[0];
    expect(resultItem.quantity).toBeDefined();
  });

  it ('adds a quantity of 1', () => {
    const result = commerceReducer(previousState, action);
    const resultItem = result.cart[0];
    expect(resultItem.quantity).toStrictEqual(1);
  });

  describe('the item is already in the cart', () => {
    describe('multi-use', () => {
      it ('increments the existing quantity', () => {
        const myAction = {...action};
        const myPreviousState = {...previousState};
        myPreviousState.cart = [
          {
            identifier: 'meow',
            quantity: 15,
          }
        ];
        myAction.item = {
          identifier: 'meow',
        }

        const result = commerceReducer(myPreviousState, myAction);
        const resultItem = result.cart[0];
        expect(resultItem.quantity).toStrictEqual(16);
      });
    });
    describe('single-use', () => {
      it ('makes no changes', () => {
        const myAction = {...action};
        const myPreviousState = {...previousState};
        myPreviousState.cart = [
          {
            identifier: 'meow',
            determination: 'single_use',
            quantity: 1,
          }
        ];
        myAction.item = {
          identifier: 'meow',
          determination: 'single_use',
        }

        const result = commerceReducer(myPreviousState, myAction);
        expect(result.cart.length).toStrictEqual(1);

        const item = result.cart[0];
        expect(item.quantity).toStrictEqual(1);
      });
    });
  });

  describe ('the item is not yet in the cart', () => {
    describe ('a single-use item', () => {
      it ('adds it to the cart', () => {
        // This is an idempotency safeguard
        const myAction = {...action};
        myAction.item = {
          identifier: 'meow',
          determination: 'single_use',
        }

        const result = commerceReducer(previousState, myAction);
        expect(result.cart.length).toStrictEqual(1);

        const item = result.cart[0];
        expect(item.quantity).toStrictEqual(1);
      });
    });
  });

  // if the item is single-use or an event:
  //  - other division items get marked as unavailable
  // if the new quantity is 1
  //  - the cart is modified to have the added item
  //  - the set of available items is updated to reflect the addition of this item to the cart
  // otherwise
  //  - it was already in the cart, so it gets updated

  // if the item is an event
  //  - does an eligible discount item also get added?
  //  - does an event-linked late fee also get added?
});