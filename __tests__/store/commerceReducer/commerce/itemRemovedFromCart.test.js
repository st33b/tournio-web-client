import {itemRemovedFromCart} from "../../../../src/store/commerce/itemRemovedFromCart";

describe('itemRemovedFromCart -- dedicated function', () => {
  // Prerequisites:
  // state:
  //  - cart is defined, and contains a list of added items, not empty. Each cart item includes a quantity
  //  - availableItems is a map of identifier to item details, not empty
  // Postrequisites:
  // - If the cart item's quantity was 1, it is no longer in the cart.
  // - If the cart item's quantity was >1, its quantity is decremented.
  // - The item in "available items" is no longer marked as added to cart -- so that the UI can indicate as much

  const basicItem = {
    identifier: 'basic',
    value: 15,
    addedToCart: true,
  }
  const previousState = {
    cart: [basicItem],
    availableItems: {
      [basicItem.identifier]: basicItem,
    },
    availableApparelItems: {},

    purchasedItems: [],
  };

  describe('a ledger item', () => {
    const myBasicItem = {
      ...basicItem,
      category: 'ledger',
      quantity: 1,
    };

    const myPreviousState = {
      ...previousState,
      cart: [myBasicItem],
    }

    const result = itemRemovedFromCart(myPreviousState, myBasicItem);

    it('removes the ledger item', () => {
      // console.log("Previous state", previousState);
      // expect(result.cart.length).toStrictEqual(0);
    });
  });

  describe('a bowling item', () => {
    describe('single-use', () => {
      describe('division', () => {

      });
    });

    describe('multi-use', () => {

    });
  });

  describe('a sanction item', () => {

  });

  describe('an event item', () => {

  });

  describe('a product - general', () => {

  });

  describe('a product - apparel - not sized', () => {

  });

  describe('a product - apparel - a specific size', () => {

  });
});
