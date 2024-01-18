import {itemRemovedFromCart} from "../../../../src/store/commerce/itemRemovedFromCart";
import {id} from "date-fns/locale";

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
  }
  const previousState = {
    cart: [basicItem],
    availableItems: [
      basicItem,
    ],
    availableApparelItems: [],
    signupables: [],
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
      addedToCart: true,
      category: 'ledger',
      quantity: 1,
    };

    const myPreviousState = {
      ...previousState,
      cart: [myBasicItem],
      availableItems: [
        myBasicItem,
      ],
    }

    const result = itemRemovedFromCart(myPreviousState, myBasicItem);

    it('removes the ledger item', () => {
      expect(result.cart.length).toStrictEqual(0);
    });

    it('drops the quantity to zero', () => {
      const item = result.availableItems.find(({identifier}) => identifier === myBasicItem.identifier);
      expect(item.quantity).toStrictEqual(0);
    });

    it('marks addedToCart as false', () => {
      const item = result.availableItems.find(({identifier}) => identifier === myBasicItem.identifier);
      expect(item.addedToCart).toBeFalsy();
    });
  });

  describe('a bowling item', () => {
    describe('single-use', () => {
      const myItem = {
        ...basicItem,
        addedToCart: true,
        category: 'bowling',
        determination: 'single_use',
        name: 'An optional bowling thing',
        quantity: 1,
      };

      const myPreviousState = {
        ...previousState,
        cart: [myItem],
        availableItems: [],
        signupables: [
          myItem,
        ],
      }

      const result = itemRemovedFromCart(myPreviousState, myItem);

      it('removes the item', () => {
        expect(result.cart.length).toStrictEqual(0);
      });

      it('drops the quantity to zero', () => {
        const item = result.availableItems.find(({identifier}) => identifier === myItem.identifier);
        expect(item.quantity).toStrictEqual(0);
      });

      it('marks addedToCart as false', () => {
        const item = result.availableItems.find(({identifier}) => identifier === myItem.identifier);
        expect(item.addedToCart).toBeFalsy();
      });

      describe('division', () => {
        const myDivisionItem = {
          ...basicItem,
          addedToCart: true,
          category: 'bowling',
          determination: 'single_use',
          refinement: 'division',
          name: 'elite scratch competition',
          identifier: 'carlyrae',
        };

        // they must have the same name
        const divisionItems = [
          {
            category: 'bowling',
            determination: 'single_use',
            refinement: 'division',
            name: myDivisionItem.name,
            identifier: 'abba',
            addedToCart: true,
          },
          {
            category: 'bowling',
            determination: 'single_use',
            refinement: 'division',
            name: myDivisionItem.name,
            identifier: 'beyonce',
            addedToCart: true,
          },
          {
            category: 'bowling',
            determination: 'single_use',
            refinement: 'division',
            name: myDivisionItem.name,
            identifier: 'carlyrae',
            addedToCart: true,
          },
          {
            category: 'bowling',
            determination: 'single_use',
            refinement: 'division',
            name: myDivisionItem.name,
            identifier: 'dolly',
            addedToCart: true,
          },
        ];

        const myPreviousState = {
          ...previousState,
          cart: [myDivisionItem],
          availableItems: previousState.availableItems.concat(divisionItems),
        };

        const result = itemRemovedFromCart(myPreviousState, myDivisionItem);

        it ('removes it from the cart', () => {
          expect(result.cart.length).toStrictEqual(0);
        });

        it ('marks the other items in the division as available', () => {
          const availableDivisionItems = result.availableItems.filter(({name}) => name === myDivisionItem.name);
          expect(availableDivisionItems.length).toBe(divisionItems.length);
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
          availableItems: [
            myBasicItem,
          ],
        }

        const result = itemRemovedFromCart(myPreviousState, myBasicItem);

        it('removes the product item', () => {
          expect(result.cart.length).toStrictEqual(0);
        });

        it('drops the quantity to zero', () => {
          const item = result.availableItems.find(({identifier}) => identifier === myBasicItem.identifier);
          expect(item.quantity).toStrictEqual(0);
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
          availableItems: [
            myBasicItem,
          ],
        }

        const result = itemRemovedFromCart(myPreviousState, myBasicItem);

        it('leaves the item in the cart', () => {
          expect(result.cart.length).toStrictEqual(myPreviousState.cart.length);
        });

        it('drops the quantity by 1', () => {
          const item = result.availableItems.find(({identifier}) => identifier === myBasicItem.identifier);
          expect(item.quantity).toStrictEqual(myBasicItem.quantity - 1);
        });
      });
    });
  });

  describe('a sanction item', () => {
    const myBasicItem = {
      ...basicItem,
      addedToCart: true,
      category: 'sanction',
      quantity: 1,
    };

    const myPreviousState = {
      ...previousState,
      cart: [myBasicItem],
      availableItems: [
        myBasicItem,
      ],
    }

    const result = itemRemovedFromCart(myPreviousState, myBasicItem);

    it('removes the sanction item', () => {
      expect(result.cart.length).toStrictEqual(0);
    });

    it('drops the quantity to zero', () => {
      const item = result.availableItems.find(({identifier}) => identifier === myBasicItem.identifier);
      expect(item.quantity).toStrictEqual(0);
    });

    it('marks addedToCart as false', () => {
      const item = result.availableItems.find(({identifier}) => identifier === myBasicItem.identifier);
      expect(item.addedToCart).toBeFalsy();
    });
  });

  describe('an event item', () => {
    const myBasicItem = {
      ...basicItem,
      addedToCart: true,
      identifier: 'a_core_event',
      category: 'bowling',
      determination: 'event',
      quantity: 1,
    }
    const myPreviousState = {
      ...previousState,
      availableItems: [
        myBasicItem,
      ],
      cart: [myBasicItem],
    };

    const result = itemRemovedFromCart(myPreviousState, myBasicItem);

    // Expected to behave like any other single_use bowling item
    it('removes the item', () => {
      expect(result.cart.length).toStrictEqual(0);
    });

    it('drops the quantity to zero', () => {
      const item = result.availableItems.find(({identifier}) => identifier === myBasicItem.identifier);
      expect(item.quantity).toStrictEqual(0);
    });

    it('marks addedToCart as false', () => {
      const item = result.availableItems.find(({identifier}) => identifier === myBasicItem.identifier);
      expect(item.addedToCart).toBeFalsy();
    });

    //
    // TODO: Events, bundle discounts, and late fees
    //
    // How should they work in this brave new world?
    //
    // describe('with a linked bundle discount in the cart', () => {
    //   const otherItem = {
    //     ...basicItem,
    //     addedToCart: true,
    //     identifier: 'another-core-event',
    //     category: 'bowling',
    //     determination: 'event',
    //     quantity: 1,
    //   };
    //
    //   const discountItem = {
    //     ...basicItem,
    //     addedToCart: true,
    //     identifier: 'bundle_up',
    //     category: 'ledger',
    //     determination: 'bundle_discount',
    //     configuration: {
    //       events: [
    //         myBasicItem.identifier,
    //         otherItem.identifier,
    //       ],
    //     },
    //     quantity: 1,
    //   };
    //
    //   const discountedPreviousState = {
    //     ...myPreviousState,
    //     cart: [...myPreviousState.cart, otherItem, discountItem],
    //     availableItems: {
    //       ...myPreviousState.availableItems,
    //       [otherItem.identifier]: otherItem,
    //       [discountItem.identifier]: discountItem,
    //     }
    //   };
    //
    //   const result = itemRemovedFromCart(discountedPreviousState, myBasicItem);
    //
    //   it('removes the item and the discount', () => {
    //     expect(result.cart.length).toStrictEqual(discountedPreviousState.cart.length - 2);
    //   });
    //
    //   it('drops the quantity to zero on the event item', () => {
    //     expect(result.availableItems[myBasicItem.identifier].quantity).toStrictEqual(0);
    //   });
    //
    //   it('drops the quantity to zero on the discount item', () => {
    //     expect(result.availableItems[discountItem.identifier].quantity).toStrictEqual(0);
    //   });
    //
    //   it('marks addedToCart as false on the event item', () => {
    //     expect(result.availableItems[myBasicItem.identifier].addedToCart).toBeFalsy();
    //   });
    //
    //   it('marks addedToCart as false on the discount item', () => {
    //     expect(result.availableItems[discountItem.identifier].addedToCart).toBeFalsy();
    //   });
    //
    //   it("does not change the other item's addedToCart", () => {
    //     expect(result.availableItems[otherItem.identifier].addedToCart).toBeTruthy();
    //   });
    //
    //   it("does not change the other item's quantity", () => {
    //     expect(result.availableItems[otherItem.identifier].quantity).toStrictEqual(1);
    //   });
    //
    //   it("leaves the other item in the cart", () => {
    //     const matchingItems = result.cart.filter(({identifier}) => identifier === otherItem.identifier);
    //     expect(matchingItems.length).toStrictEqual(1);
    //   });
    // });
    //
    // describe('with a linked late fee in the cart', () => {
    //   const lateFeeItem = {
    //     ...basicItem,
    //     addedToCart: true,
    //     identifier: 'you_are_late',
    //     category: 'ledger',
    //     determination: 'late_fee',
    //     configuration: {
    //       event: myBasicItem.identifier,
    //     },
    //     quantity: 1,
    //   };
    //
    //   const latePreviousState = {
    //     ...myPreviousState,
    //     cart: [...myPreviousState.cart, lateFeeItem],
    //     availableItems: {
    //       ...myPreviousState.availableItems,
    //       [lateFeeItem.identifier]: lateFeeItem,
    //     }
    //   };
    //
    //   const result = itemRemovedFromCart(latePreviousState, myBasicItem);
    //
    //   it('removes the item and the late fee', () => {
    //     expect(result.cart.length).toStrictEqual(latePreviousState.cart.length - 2);
    //   });
    //
    //   it('drops the quantity to zero on the event item', () => {
    //     expect(result.availableItems[myBasicItem.identifier].quantity).toStrictEqual(0);
    //   });
    //
    //   it('drops the quantity to zero on the late fee item', () => {
    //     expect(result.availableItems[lateFeeItem.identifier].quantity).toStrictEqual(0);
    //   });
    //
    //   it('marks addedToCart as false on the event item', () => {
    //     expect(result.availableItems[myBasicItem.identifier].addedToCart).toBeFalsy();
    //   });
    //
    //   it('marks addedToCart as false on the late fee item', () => {
    //     expect(result.availableItems[lateFeeItem.identifier].addedToCart).toBeFalsy();
    //   });
    // });
  });

  describe('a banquet item', () => {
    const myBasicItem = {
      ...basicItem,
      category: 'banquet',
      name: 'Tasty Noms',
    };

    describe("when there's just one left in the cart", () => {
      const banquetItem = {
        ...myBasicItem,
        quantity: 1,
      }
      const myPreviousState = {
        ...previousState,
        cart: [banquetItem],
        availableItems: [
          banquetItem,
        ],
      }

      const result = itemRemovedFromCart(myPreviousState, banquetItem);

      it('removes the banquet item', () => {
        expect(result.cart.length).toStrictEqual(0);
      });

      it('drops the quantity to zero', () => {
        const item = result.availableItems.find(({identifier}) => identifier === banquetItem.identifier);
        expect(item.quantity).toStrictEqual(0);
      });
    });

    describe("when there's more than one in the cart", () => {
      const banquetItem = {
        ...myBasicItem,
        quantity: 12,
      }
      const myPreviousState = {
        ...previousState,
        cart: [banquetItem],
        availableItems: [
          banquetItem,
        ],
      }

      const result = itemRemovedFromCart(myPreviousState, banquetItem);

      it('leaves the item in the cart', () => {
        expect(result.cart.length).toStrictEqual(myPreviousState.cart.length);
      });

      it('drops the quantity by 1', () => {
        const item = result.availableItems.find(({identifier}) => identifier === banquetItem.identifier);
        expect(item.quantity).toStrictEqual(banquetItem.quantity - 1);
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
        availableItems: [
          myBasicItem,
        ],
      }

      const result = itemRemovedFromCart(myPreviousState, myBasicItem);

      it('removes the product item', () => {
        expect(result.cart.length).toStrictEqual(0);
      });

      it('drops the quantity to zero', () => {
        const item = result.availableItems.find(({identifier}) => identifier === myBasicItem.identifier);
        expect(item.quantity).toStrictEqual(0);
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
        availableItems: [
          myBasicItem,
        ],
      }

      const result = itemRemovedFromCart(myPreviousState, myBasicItem);

      it('leaves the item in the cart', () => {
        expect(result.cart.length).toStrictEqual(myPreviousState.cart.length);
      });

      it('drops the quantity by 1', () => {
        const item = result.availableItems.find(({identifier}) => identifier === myBasicItem.identifier);
        expect(item.quantity).toStrictEqual(myBasicItem.quantity - 1);
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
        availableItems: [
          myBasicItem,
        ],
      }

      const result = itemRemovedFromCart(myPreviousState, myBasicItem);

      it('removes the product item', () => {
        expect(result.cart.length).toStrictEqual(0);
      });

      it('drops the quantity to zero', () => {
        const item = result.availableItems.find(({identifier}) => identifier === myBasicItem.identifier);
        expect(item.quantity).toStrictEqual(0);
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
        availableItems: [
          myBasicItem,
        ],
      }

      const result = itemRemovedFromCart(myPreviousState, myBasicItem);

      it('leaves the item in the cart', () => {
        expect(result.cart.length).toStrictEqual(myPreviousState.cart.length);
      });

      it('drops the quantity by 1', () => {
        const item = result.availableItems.find(({identifier}) => identifier === myBasicItem.identifier);
        expect(item.quantity).toStrictEqual(myBasicItem.quantity - 1);
      });
    });
  });

  describe('a product - apparel - a specific size', () => {
    const parentItem = {
      ...basicItem,
      identifier: 'something-to-wear',
      category: 'product',
      determination: 'apparel',
      refinement: 'sized',
      name: 'A turtleneck',
      configuration: {
        sizes: [
          {
            identifier: 'in-a-small',
            size: 'men.s',
            displaySize: 'Small!',
            parentIdentifier: 'something-to-wear',
            category: 'product',
            name: 'A turtleneck',
            note: '',
            value: 17,
            quantity: 0,
          },
          {
            identifier: 'in-a-medium',
            size: 'men.m',
            displaySize: 'Medium!',
            parentIdentifier: 'something-to-wear',
            category: 'product',
            name: 'A turtleneck',
            note: '',
            value: 19,
            quantity: 0,
          },
          {
            identifier: 'in-a-large',
            size: 'men.l',
            displaySize: 'Large!',
            parentIdentifier: 'something-to-wear',
            category: 'product',
            name: 'A turtleneck',
            note: '',
            value: 21,
            quantity: 0,
          },
        ],
      },
      value: 39,
    }

    describe("when there's just one left in the cart", () => {
      const chosenItem = parentItem.configuration.sizes[1];

      const myPreviousState = {
        ...previousState,
        availableApparelItems: [
          parentItem,
        ],
        cart: [
          {
            ...chosenItem,
            quantity: 1,
          }
        ],
      };

      const result = itemRemovedFromCart(myPreviousState, myPreviousState.cart[0]);

      it('removes the item from the cart', () => {
        expect(result.cart.length).toStrictEqual(0);
      });
    });

    describe("when there's more than one in the cart", () => {
      const chosenItem = parentItem.configuration.sizes[2];

      const myPreviousState = {
        ...previousState,
        availableApparelItems: [
          parentItem,
        ],
        cart: [
          {
            ...chosenItem,
            quantity: 6,
          }
        ],
      };

      const result = itemRemovedFromCart(myPreviousState, myPreviousState.cart[0]);

      it('leaves the item in the cart', () => {
        expect(result.cart.length).toStrictEqual(1);
      });

      it('drops the quantity on the item with that size by 1', () => {
        const itemWithSize = result.cart.find(({identifier}) => identifier === chosenItem.identifier);
        expect(itemWithSize.quantity).toStrictEqual(myPreviousState.cart[0].quantity - 1);
      });
    });
  });

  describe('a raffle item', () => {
    const myBasicItem = {
      ...basicItem,
      category: 'raffle',
      name: 'Prizes and stuff',
    };

    describe("when there's just one left in the cart", () => {
      const raffleItem = {
        ...myBasicItem,
        quantity: 1,
      }
      const myPreviousState = {
        ...previousState,
        cart: [raffleItem],
        availableItems: [
          raffleItem,
        ],
      }

      const result = itemRemovedFromCart(myPreviousState, raffleItem);

      it('removes the raffle item', () => {
        expect(result.cart.length).toStrictEqual(0);
      });

      it('drops the quantity to zero', () => {
        const item = result.availableItems.find(({identifier}) => identifier === raffleItem.identifier);
        expect(item.quantity).toStrictEqual(0);
      });
    });

    describe("when there's more than one in the cart", () => {
      const raffleItem = {
        ...myBasicItem,
        quantity: 12,
      }
      const myPreviousState = {
        ...previousState,
        cart: [raffleItem],
        availableItems: [
          raffleItem,
        ],
      }

      const result = itemRemovedFromCart(myPreviousState, raffleItem);

      it('leaves the item in the cart', () => {
        expect(result.cart.length).toStrictEqual(myPreviousState.cart.length);
      });

      it('drops the quantity by 1', () => {
        const item = result.availableItems.find(({identifier}) => identifier === raffleItem.identifier);
        expect(item.quantity).toStrictEqual(raffleItem.quantity - 1);
      });
    });

  });

});
