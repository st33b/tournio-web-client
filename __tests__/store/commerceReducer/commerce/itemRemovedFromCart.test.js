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
  };

  describe('an unknown kind of item', () => {
    const myBasicItem = {
      ...basicItem,
      category: 'strange',
      quantity: 1,
    };

    const myPreviousState = {...previousState}

    const result = itemRemovedFromCart(myPreviousState, myBasicItem);

    it('makes no changes', () => {
      expect(result).toStrictEqual(myPreviousState);
    });
  });

  describe('a ledger item', () => {
    const myBasicItem = {
      ...basicItem,
      category: 'ledger',
      quantity: 1,
    };

    const myPreviousState = {
      ...previousState,
      cart: [myBasicItem],
      availableItems: {
        [myBasicItem.identifier]: myBasicItem,
      }
    }

    const result = itemRemovedFromCart(myPreviousState, myBasicItem);

    it('removes the ledger item', () => {
      expect(result.cart.length).toStrictEqual(0);
    });

    it('drops the quantity to zero', () => {
      expect(result.availableItems[myBasicItem.identifier].quantity).toStrictEqual(0);
    });

    it('marks addedToCart as false', () => {
      expect(result.availableItems[myBasicItem.identifier].addedToCart).toBeFalsy();
    });
  });

  describe('a bowling item', () => {
    describe('single-use', () => {
      const myItem = {
        ...basicItem,
        category: 'bowling',
        determination: 'single_use',
        name: 'An optional bowling thing',
        quantity: 1,
      };

      const myPreviousState = {
        ...previousState,
        cart: [myItem],
        availableItems: {
          [myItem.identifier]: myItem,
        }
      }

      const result = itemRemovedFromCart(myPreviousState, myItem);

      it('removes the item', () => {
        expect(result.cart.length).toStrictEqual(0);
      });

      it('drops the quantity to zero', () => {
        expect(result.availableItems[myItem.identifier].quantity).toStrictEqual(0);
      });

      it('marks addedToCart as false', () => {
        expect(result.availableItems[myItem.identifier].addedToCart).toBeFalsy();
      });

      describe('division', () => {
        const myDivisionItem = {
          ...basicItem,
          category: 'bowling',
          determination: 'single_use',
          refinement: 'division',
          name: 'elite scratch competition',
          identifier: 'carlyrae',
        };

        // they must have the same name
        const divisionItems = {
          abba: {
            category: 'bowling',
            determination: 'single_use',
            refinement: 'division',
            name: myDivisionItem.name,
            identifier: 'abba',
            addedToCart: true,
          },
          beyonce: {
            category: 'bowling',
            determination: 'single_use',
            refinement: 'division',
            name: myDivisionItem.name,
            identifier: 'beyonce',
            addedToCart: true,
          },
          carlyrae: {
            category: 'bowling',
            determination: 'single_use',
            refinement: 'division',
            name: myDivisionItem.name,
            identifier: 'carlyrae',
            addedToCart: true,
          },
          dolly: {
            category: 'bowling',
            determination: 'single_use',
            refinement: 'division',
            name: myDivisionItem.name,
            identifier: 'dolly',
            addedToCart: true,
          },
        };

        const myPreviousState = {
          ...previousState,
          cart: [myDivisionItem],
          availableItems: {
            ...previousState.availableItems,
            ...divisionItems,
          },
        };

        const result = itemRemovedFromCart(myPreviousState, myDivisionItem);

        it ('removes it from the cart', () => {
          expect(result.cart.length).toStrictEqual(0);
        });

        it ('marks the other items in the division as available', () => {
          const availableDivisionItems = Object.values(result.availableItems).filter(({name}) => name === myDivisionItem.name);
          expect(availableDivisionItems.length).toBe(Object.keys(divisionItems).length);
          const allRemovedFromCart = availableDivisionItems.every(item => !item.addedToCart);
          expect(allRemovedFromCart).toBeTruthy();
        });
      });
    });

    describe('multi-use', () => {
      describe("when there's just one left in the cart", () => {
        const myBasicItem = {
          ...basicItem,
          category: 'bowling',
          determination: 'multi_use',
          name: 'Bowling D&D',
          quantity: 1,
        };

        const myPreviousState = {
          ...previousState,
          cart: [myBasicItem],
          availableItems: {
            [myBasicItem.identifier]: myBasicItem,
          }
        }

        const result = itemRemovedFromCart(myPreviousState, myBasicItem);

        it('removes the product item', () => {
          expect(result.cart.length).toStrictEqual(0);
        });

        it('drops the quantity to zero', () => {
          expect(result.availableItems[myBasicItem.identifier].quantity).toStrictEqual(0);
        });

        it('marks addedToCart as false', () => {
          expect(result.availableItems[myBasicItem.identifier].addedToCart).toBeFalsy();
        });
      });

      describe("when there's more than one in the cart", () => {
        const myBasicItem = {
          ...basicItem,
          category: 'bowling',
          determination: 'multi_use',
          name: 'Bowling Blackjack',
          quantity: 7,
        };

        const myPreviousState = {
          ...previousState,
          cart: [myBasicItem],
          availableItems: {
            [myBasicItem.identifier]: myBasicItem,
          }
        }

        const result = itemRemovedFromCart(myPreviousState, myBasicItem);

        it('leaves the item in the cart', () => {
          expect(result.cart.length).toStrictEqual(myPreviousState.cart.length);
        });

        it('drops the quantity by 1', () => {
          expect(result.availableItems[myBasicItem.identifier].quantity).toStrictEqual(myBasicItem.quantity - 1);
        });

        it('leaves addedToCart as true', () => {
          expect(result.availableItems[myBasicItem.identifier].addedToCart).toBeTruthy();
        });
      });
    });
  });

  describe('a sanction item', () => {
    const myBasicItem = {
      ...basicItem,
      category: 'sanction',
      quantity: 1,
    };

    const myPreviousState = {
      ...previousState,
      cart: [myBasicItem],
      availableItems: {
        [myBasicItem.identifier]: myBasicItem,
      }
    }

    const result = itemRemovedFromCart(myPreviousState, myBasicItem);

    it('removes the sanction item', () => {
      expect(result.cart.length).toStrictEqual(0);
    });

    it('drops the quantity to zero', () => {
      expect(result.availableItems[myBasicItem.identifier].quantity).toStrictEqual(0);
    });

    it('marks addedToCart as false', () => {
      expect(result.availableItems[myBasicItem.identifier].addedToCart).toBeFalsy();
    });
  });

  describe('an event item', () => {
    const myBasicItem = {
      ...basicItem,
      identifier: 'a_core_event',
      category: 'bowling',
      determination: 'event',
      quantity: 1,
    }
    const myPreviousState = {
      ...previousState,
      availableItems: {
        [myBasicItem.identifier]: myBasicItem,
      },
      cart: [myBasicItem],
    };

    const result = itemRemovedFromCart(myPreviousState, myBasicItem);

    // Expected to behave like any other single_use bowling item
    it('removes the item', () => {
      expect(result.cart.length).toStrictEqual(0);
    });

    it('drops the quantity to zero', () => {
      expect(result.availableItems[myBasicItem.identifier].quantity).toStrictEqual(0);
    });

    it('marks addedToCart as false', () => {
      expect(result.availableItems[myBasicItem.identifier].addedToCart).toBeFalsy();
    });

    describe('with a linked bundle discount in the cart', () => {
      const otherItem = {
        ...basicItem,
        identifier: 'another-core-event',
        category: 'bowling',
        determination: 'event',
        quantity: 1,
      };

      const discountItem = {
        ...basicItem,
        identifier: 'bundle_up',
        category: 'ledger',
        determination: 'bundle_discount',
        configuration: {
          events: [
            myBasicItem.identifier,
            otherItem.identifier,
          ],
        },
        quantity: 1,
      };

      const discountedPreviousState = {
        ...myPreviousState,
        cart: [...myPreviousState.cart, otherItem, discountItem],
        availableItems: {
          ...myPreviousState.availableItems,
          [otherItem.identifier]: otherItem,
          [discountItem.identifier]: discountItem,
        }
      };

      const result = itemRemovedFromCart(discountedPreviousState, myBasicItem);

      it('removes the item and the discount', () => {
        expect(result.cart.length).toStrictEqual(discountedPreviousState.cart.length - 2);
      });

      it('drops the quantity to zero on the event item', () => {
        expect(result.availableItems[myBasicItem.identifier].quantity).toStrictEqual(0);
      });

      it('drops the quantity to zero on the discount item', () => {
        expect(result.availableItems[discountItem.identifier].quantity).toStrictEqual(0);
      });

      it('marks addedToCart as false on the event item', () => {
        expect(result.availableItems[myBasicItem.identifier].addedToCart).toBeFalsy();
      });

      it('marks addedToCart as false on the discount item', () => {
        expect(result.availableItems[discountItem.identifier].addedToCart).toBeFalsy();
      });

      it("does not change the other item's addedToCart", () => {
        expect(result.availableItems[otherItem.identifier].addedToCart).toBeTruthy();
      });

      it("does not change the other item's quantity", () => {
        expect(result.availableItems[otherItem.identifier].quantity).toStrictEqual(1);
      });

      it("leaves the other item in the cart", () => {
        const matchingItems = result.cart.filter(({identifier}) => identifier === otherItem.identifier);
        expect(matchingItems.length).toStrictEqual(1);
      });
    });

    describe('with a linked late fee in the cart', () => {
      const lateFeeItem = {
        ...basicItem,
        identifier: 'you_are_late',
        category: 'ledger',
        determination: 'late_fee',
        configuration: {
          event: myBasicItem.identifier,
        },
        quantity: 1,
      };

      const latePreviousState = {
        ...myPreviousState,
        cart: [...myPreviousState.cart, lateFeeItem],
        availableItems: {
          ...myPreviousState.availableItems,
          [lateFeeItem.identifier]: lateFeeItem,
        }
      };

      const result = itemRemovedFromCart(latePreviousState, myBasicItem);

      it('removes the item and the late fee', () => {
        expect(result.cart.length).toStrictEqual(latePreviousState.cart.length - 2);
      });

      it('drops the quantity to zero on the event item', () => {
        expect(result.availableItems[myBasicItem.identifier].quantity).toStrictEqual(0);
      });

      it('drops the quantity to zero on the late fee item', () => {
        expect(result.availableItems[lateFeeItem.identifier].quantity).toStrictEqual(0);
      });

      it('marks addedToCart as false on the event item', () => {
        expect(result.availableItems[myBasicItem.identifier].addedToCart).toBeFalsy();
      });

      it('marks addedToCart as false on the late fee item', () => {
        expect(result.availableItems[lateFeeItem.identifier].addedToCart).toBeFalsy();
      });
    });
  });

  describe('a product - general', () => {
    describe("when there's just one left in the cart", () => {
      const myBasicItem = {
        ...basicItem,
        category: 'product',
        determination: 'thingamabob',
        name: 'A thing',
        note: '',
        quantity: 1,
      };

      const myPreviousState = {
        ...previousState,
        cart: [myBasicItem],
        availableItems: {
          [myBasicItem.identifier]: myBasicItem,
        }
      }

      const result = itemRemovedFromCart(myPreviousState, myBasicItem);

      it('removes the product item', () => {
        expect(result.cart.length).toStrictEqual(0);
      });

      it('drops the quantity to zero', () => {
        expect(result.availableItems[myBasicItem.identifier].quantity).toStrictEqual(0);
      });

      it('marks addedToCart as false', () => {
        expect(result.availableItems[myBasicItem.identifier].addedToCart).toBeFalsy();
      });
    });

    describe("when there's more than one in the cart", () => {
      const myBasicItem = {
        ...basicItem,
        category: 'product',
        determination: 'thingamabob',
        name: 'A thing',
        note: '',
        quantity: 12,
      };

      const myPreviousState = {
        ...previousState,
        cart: [myBasicItem],
        availableItems: {
          [myBasicItem.identifier]: myBasicItem,
        }
      }

      const result = itemRemovedFromCart(myPreviousState, myBasicItem);

      it('leaves the item in the cart', () => {
        expect(result.cart.length).toStrictEqual(myPreviousState.cart.length);
      });

      it('drops the quantity by 1', () => {
        expect(result.availableItems[myBasicItem.identifier].quantity).toStrictEqual(myBasicItem.quantity - 1);
      });

      it('leaves addedToCart as true', () => {
        expect(result.availableItems[myBasicItem.identifier].addedToCart).toBeTruthy();
      });
    });
  });

  describe('a product - apparel - not sized', () => {
    describe("when there's just one left in the cart", () => {
      const myBasicItem = {
        ...basicItem,
        category: 'product',
        determination: 'apparel',
        name: 'A one-size-fits-all thing',
        note: '',
        quantity: 1,
      };

      const myPreviousState = {
        ...previousState,
        cart: [myBasicItem],
        availableItems: {
          [myBasicItem.identifier]: myBasicItem,
        }
      }

      const result = itemRemovedFromCart(myPreviousState, myBasicItem);

      it('removes the product item', () => {
        expect(result.cart.length).toStrictEqual(0);
      });

      it('drops the quantity to zero', () => {
        expect(result.availableItems[myBasicItem.identifier].quantity).toStrictEqual(0);
      });

      it('marks addedToCart as false', () => {
        expect(result.availableItems[myBasicItem.identifier].addedToCart).toBeFalsy();
      });
    });

    describe("when there's more than one in the cart", () => {
      const myBasicItem = {
        ...basicItem,
        category: 'product',
        determination: 'apparel',
        name: 'A one-size piece of apparel',
        note: 'available in only one size, like a hat',
        quantity: 12,
      };

      const myPreviousState = {
        ...previousState,
        cart: [myBasicItem],
        availableItems: {
          [myBasicItem.identifier]: myBasicItem,
        }
      }

      const result = itemRemovedFromCart(myPreviousState, myBasicItem);

      it('leaves the item in the cart', () => {
        expect(result.cart.length).toStrictEqual(myPreviousState.cart.length);
      });

      it('drops the quantity by 1', () => {
        expect(result.availableItems[myBasicItem.identifier].quantity).toStrictEqual(myBasicItem.quantity - 1);
      });

      it('leaves addedToCart as true', () => {
        expect(result.availableItems[myBasicItem.identifier].addedToCart).toBeTruthy();
      });
    });
  });

  describe('a product - apparel - a specific size', () => {

  });
});
