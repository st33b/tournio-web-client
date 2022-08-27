import * as actionTypes from '../../../src/store/actions/actionTypes';
import {commerceReducer} from "../../../src/store/commerceReducer";

describe('item added to cart', () => {
  // Prerequisites:
  // state:
  //  - cart is defined, and contains a list of added items, possibly empty. Each cart item includes a quantity
  //  - availableItems is a map of identifier to item details, possibly empty
  //  - purchasedItems is a list of items, possibly empty -- passed as a function arg when item.determination is 'event'
  //  - tournament -- passed as a function arg when item.determination is 'event'
  // Postrequisites:
  // - The item in the cart contains an updated quantity
  // - The item in "available items" is marked as added to cart -- so that the UI can indicate as much

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

      it ('increments the existing quantity', () => {
        const resultItem = result.cart[0];
        expect(resultItem.quantity).toStrictEqual(16);
      });

      it ('does not change the number of distinct items in the cart', () => {
        expect(result.cart.length).toEqual(myPreviousState.cart.length);
      })
    });
    describe('single-use', () => {
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
      it ('makes no changes', () => {
        expect(result.cart.length).toEqual(myPreviousState.cart.length);
        const item = result.cart[0];
        expect(item.quantity).toStrictEqual(1);
      });
    });
  });

  describe ('the item is not yet in the cart', () => {
    const myAction = {...action};
    myAction.item = {
      identifier: 'meow',
      determination: 'single_use',
    }
    const result = commerceReducer(previousState, myAction);

    it ('adds it to the cart', () => {
      expect(result.cart.length).toStrictEqual(1);
      const item = result.cart[0];
      expect(item.quantity).toStrictEqual(1);
    });

    describe ('a single-use item', () => {
      it ('marks the item in availableItems as added to cart', () => {
        const item = result.availableItems[myAction.item.identifier];
        expect(item.addedToCart).toBeDefined();
        expect(item.addedToCart).toBeTruthy();
      });
    });
    describe ('a division item', () => {
      it ('marks the other items in the division as unavailable', () => {

      });
    });
    describe ('an event', () => {
      myAction.item.determination = 'event';

      it ('behaves like a ledger item', () => {
        expect(result.cart.length).toStrictEqual(1);
        const item = result.cart[0];
        expect(item.quantity).toStrictEqual(1);
      });

      describe ('with an eligible bundle discount', () => {
        const myPreviousState = {...previousState};
        const discountItem = {
          identifier: 'bundle_up',
          category: 'ledger',
          determination: 'bundle_discount',
        }
        myPreviousState.availableItems[discountItem.identifier] = discountItem;
        const result = commerceReducer(myPreviousState, action);

        
      });
      // if there's an eligible bundle discount, add it to the cart
      // --> can we do this using recursion? surely we can, since it's a pure function...

      // if there's an applicable late fee, add it to the cart
      // --> ditto about using recursion
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