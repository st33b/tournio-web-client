import * as actionTypes from '../../../src/store/actions/actionTypes';
import {commerceReducer} from "../../../src/store/commerceReducer";

describe('item added to cart', () => {
  // Prerequisites:
  // state:
  //  - cart is defined, and contains a list of added items, not empty. Each cart item includes a quantity
  //  - availableItems is a map of identifier to item details, not empty
  // Postrequisites:
  // - If the cart item's quantity was 1, it is no longer in the cart.
  // - If the cart item's quantity was >1, its quantity is decremented.
  // - The item in "available items" is no longer marked as added to cart -- so that the UI can indicate as much

  // this is an item from the cart, not from availableItems
  const basicItem = {
    identifier: 'meh',
  }
  const action = {
    type: actionTypes.ITEM_REMOVED_FROM_CART,
    item: basicItem,
  }

  const previousState = {
    cart: [basicItem],
    availableItems: {
      meh: {
        ...basicItem,
        addedToCart: true,
      },
    },
  }

  describe ('a single-use item', () => {
    const myItem = {
      ...basicItem,
      determination: 'single_use',
      quantity: 1,
    };
    const myAction = {
      ...action,
      item: myItem,
    }
    const myPreviousState = {
      ...previousState,
      cart: [myItem],
      availableItems: {
        meh: {
          ...myItem,
          addedToCart: true,
        },
      },
    };
    it ('removes the item from the cart', () => {
      const result = commerceReducer(myPreviousState, myAction);
      expect(result.cart.length).toBe(0);
    });

    it ('marks the item in availableItems as no longer added to cart', () => {
      const result = commerceReducer(myPreviousState, myAction);
      expect(result.availableItems.meh.addedToCart).toBeFalsy();
    });

    describe ('a division-based item', () => {
      const divisionItems = {
        abba: {
          determination: 'single_use',
          refinement: 'division',
          identifier: 'abba',
          name: 'a division-based item',
        },
        beyonce: {
          determination: 'single_use',
          refinement: 'division',
          identifier: 'beyonce',
          name: 'a division-based item',
        },
        carlyrae: {
          determination: 'single_use',
          refinement: 'division',
          identifier: 'carlyrae',
          name: 'a division-based item',
        },
        dolly: {
          determination: 'single_use',
          refinement: 'division',
          identifier: 'dolly',
          name: 'a division-based item',
        },
      };

      // they must have the same name
      const myItem = {
        ...basicItem,
        determination: 'single_use',
        refinement: 'division',
        identifier: 'beyonce',
        name: 'a division-based item',
        quantity: 1,
      };

      const myAction = {
        ...action,
        item: myItem,
      }

      const myPreviousState = {
        ...previousState,
        cart: [myItem],
        availableItems: {
          ...previousState.availableItems,
          ...divisionItems,
          beyonce: {
            ...myItem,
            addedToCart: true,
          },
        },
      };

      it ('removes it from the cart', () => {
        const result = commerceReducer(myPreviousState, myAction);
        expect(result.cart.length).toBe(0);
      });

      it ('marks the other items in the division as available', () => {
        const result = commerceReducer(myPreviousState, myAction);
        const availableDivisionItems = Object.values(result.availableItems).filter(item => item.name === 'a division-based item');
        expect(availableDivisionItems.length).toBe(Object.keys(divisionItems).length);
        const anyAddedToCart = availableDivisionItems.some(item => item.addedToCart);
        expect(anyAddedToCart).toBeFalsy();
      });
    });
  });

  describe ('a multi-use item', () => {
    describe ('with a quantity of 1', () => {
      const myItem = {
        ...basicItem,
        determination: 'multi_use',
        quantity: 1,
      }
      const myAction = {
        ...action,
        item: myItem,
      }
      const myPreviousState = {
        ...previousState,
        cart: [myItem],
        availableItems: {
          meh: {
            ...myItem,
            addedToCart: true,
          },
        },
      };

      it ('removes it from the cart entirely', () => {
        const result = commerceReducer(myPreviousState, myAction);
        expect(result.cart.length).toBe(0);
      });
    });

    describe ('with a quantity greater than 1', () => {
      const myItem = {
        ...basicItem,
        determination: 'multi_use',
        quantity: 10,
      }
      const myAction = {
        ...action,
        item: myItem,
      }
      const myPreviousState = {
        ...previousState,
        cart: [myItem],
        availableItems: {
          meh: {
            ...myItem,
            addedToCart: true,
          },
        },
      };

      it ('leaves the item in the cart', () => {
        const result = commerceReducer(myPreviousState, myAction);
        expect(result.cart[0].identifier).toStrictEqual(myItem.identifier);
      })

      it ('decrements the quantity', () => {
        const result = commerceReducer(myPreviousState, myAction);
        expect(result.cart[0].quantity).toBe(myItem.quantity - 1);
      });
    });
  });

  describe ('a sanction item', () => {
    const myItem = {
      ...basicItem,
      category: 'sanction',
      determination: 'org',
      quantity: 1,
    };
    const myAction = {
      ...action,
      item: myItem,
    }
    const myPreviousState = {
      ...previousState,
      cart: [myItem],
      availableItems: {
        meh: {
          ...myItem,
          addedToCart: true,
        },
      },
    };
    it('removes the item from the cart', () => {
      const result = commerceReducer(myPreviousState, myAction);
      expect(result.cart.length).toBe(0);
    });

    it('marks the item in availableItems as no longer added to cart', () => {
      const result = commerceReducer(myPreviousState, myAction);
      expect(result.availableItems.meh.addedToCart).toBeFalsy();
    });
  });
});