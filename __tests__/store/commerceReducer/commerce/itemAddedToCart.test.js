import {itemAddedToCart} from "../../../../src/store/commerce/itemAddedToCart";

describe('itemAddedToCart -- dedicated function', () => {
  // Prerequisites:
  // state:
  //  - cart is defined, and contains a list of added items, possibly empty. Each cart item includes a quantity
  //  - availableItems is a map of identifier to item details, possibly empty, and without any apparel items
  //  - apparelItems is a map of any apparel items that are available
  //  - purchasedItems is a list of items, possibly empty -- passed as a function arg when item.determination is 'event'
  //  - signupables is a list of bowling events for which bowlers may sign up without paying, but for which they may pay after signing up
  // Postrequisites:
  // - The item in the cart contains an updated quantity
  // - The item in "available items" is marked as added to cart -- so that the UI can indicate as much

  const previousState = {
    cart: [],
    availableItems: [],
    availableApparelItems: [],
    purchasedItems: [],
    tournament: {},
    signupables: [],
  }

  describe ('the item is not yet in the cart', () => {
    describe('an unknown kind of item', () => {
      const itemToAdd = {
        identifier: 'what-is-this',
        category: 'unfamiliar',
      }
      const myPreviousState = {...previousState};

      const result = itemAddedToCart(myPreviousState, itemToAdd);

      it ('makes no changes to anything', () => {
        expect(result).toStrictEqual(myPreviousState);
      });
    })

    describe ('a bowling item', () => {
      const itemToAdd = {
        identifier: 'bowling-special',
        category: 'bowling',
        determination: 'single_use',
      }

      const myPreviousState = {...previousState};
      myPreviousState.signupables.push({...itemToAdd});

      const result = itemAddedToCart(myPreviousState, itemToAdd);

      it ('adds it to the cart', () => {
        expect(result.cart.length).toStrictEqual(1);
        const item = result.cart[0];
        expect(item.quantity).toStrictEqual(1);
      });

      it ('marks the item in signupables as added to cart', () => {
        const item = result.signupables.find(({identifier}) => identifier === itemToAdd.identifier);
        expect(item.addedToCart).toBeDefined();
        expect(item.addedToCart).toBeTruthy();
      });

      describe ('a division item', () => {
        const itemToAdd = {
          category: 'bowling',
          determination: 'single_use',
          refinement: 'division',
          name: 'a division-based item',
          identifier: 'carlyrae',
        };

        // they must have the same name
        const divisionItems = [
          {
            category: 'bowling',
            determination: 'single_use',
            refinement: 'division',
            name: 'a division-based item',
            identifier: 'abba',
          },
          {
            category: 'bowling',
            determination: 'single_use',
            refinement: 'division',
            name: 'a division-based item',
            identifier: 'beyonce',
          },
          {
            category: 'bowling',
            determination: 'single_use',
            refinement: 'division',
            name: 'a division-based item',
            identifier: 'carlyrae',
          },
          {
            category: 'bowling',
            determination: 'single_use',
            refinement: 'division',
            name: 'a division-based item',
            identifier: 'dolly',
          },
        ];

        const myPreviousState = {
          ...previousState,
          signupables: previousState.signupables.concat(divisionItems),
        };

        const result = itemAddedToCart(myPreviousState, itemToAdd);

        it ('adds it to the cart', () => {
          expect(result.cart.length).toStrictEqual(1);
          const item = result.cart[0];
          expect(item.quantity).toStrictEqual(1);
        });

        it ('marks the other items in the division as unavailable', () => {
          const availableDivisionItems = result.signupables.filter(({name}) => name === 'a division-based item');
          expect(availableDivisionItems.length).toBe(divisionItems.length);
          const allAddedToCart = availableDivisionItems.every(item => item.addedToCart);
          expect(allAddedToCart).toBeTruthy();
        });
      });

      describe ('a multi-use item', () => {
        const itemToAdd = {
          identifier: 'bowling-not-so-special',
          category: 'bowling',
          determination: 'multi_use',
        }

        const result = itemAddedToCart(myPreviousState, itemToAdd);

        it ('adds it to the cart', () => {
          expect(result.cart.length).toStrictEqual(1);
          const item = result.cart[0];
          expect(item.quantity).toStrictEqual(1);
        });
      });
    });

    describe ('a sanction item', () => {
      const itemToAdd = {
        identifier: 'make-me-official',
        category: 'sanction',
        determination: 'igbo',
      }
      const myPreviousState = {
        ...previousState,
        availableItems: [...previousState.availableItems],
      };
      myPreviousState.availableItems.push({...itemToAdd});

      const result = itemAddedToCart(myPreviousState, itemToAdd);

      it ('adds it to the cart', () => {
        expect(result.cart.length).toStrictEqual(1);
        const item = result.cart[0];
        expect(item.quantity).toStrictEqual(1);
      });
    });

    describe ('a banquet item', () => {
      const itemToAdd = {
        identifier: 'tasty-noms',
        category: 'banquet',
      }
      const myPreviousState = {...previousState};
      myPreviousState.availableItems.push({...itemToAdd});

      const result = itemAddedToCart(myPreviousState, itemToAdd);

      it ('adds it to the cart', () => {
        expect(result.cart.length).toStrictEqual(1);
      });

      it ('sets the quantity to 1', () => {
        const item = result.cart[0];
        expect(item.quantity).toStrictEqual(1);
      });
    });

    describe ('a raffle item', () => {
      const itemToAdd = {
        category: 'raffle',
        identifier: 'pack-of-100',
      }
      const myPreviousState = {...previousState};
      myPreviousState.availableItems.push({...itemToAdd});

      const result = itemAddedToCart(myPreviousState, itemToAdd);

      it ('adds it to the cart', () => {
        expect(result.cart.length).toStrictEqual(1);
      });

      it ('sets the quantity to 1', () => {
        const item = result.cart[0];
        expect(item.quantity).toStrictEqual(1);
      });
    });

    describe ('a general product', () => {
      const itemToAdd = {
        identifier: 'something-to-buy',
        category: 'product',
        determination: 'general',
      }
      const myPreviousState = {...previousState};
      myPreviousState.availableItems.push({...itemToAdd});

      const result = itemAddedToCart(myPreviousState, itemToAdd);

      it ('adds it to the cart', () => {
        expect(result.cart.length).toStrictEqual(1);
        const item = result.cart[0];
        expect(item.quantity).toStrictEqual(1);
      });
    });

    describe ('an apparel product with a single size', () => {
      const itemToAdd = {
        identifier: 'something-to-buy',
        category: 'product',
        determination: 'apparel',
        refinement: 'not-sized', // not a real refinement, for the sake of testing
        size: "Ah, but I do have a size",
      }
      const myPreviousState = {...previousState};
      myPreviousState.availableItems.push({...itemToAdd});

      const result = itemAddedToCart(myPreviousState, itemToAdd);

      it ('adds it to the cart', () => {
        expect(result.cart.length).toStrictEqual(1);
        const item = result.cart[0];
        expect(item.quantity).toStrictEqual(1);
      });
    });

    describe('a product with a separate size identifier', () => {
      const itemToAdd = {
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

      const myPreviousState = {
        ...previousState,
        availableApparelItems: [
          itemToAdd,
        ],
      }

      const chosenSize = {...itemToAdd.configuration.sizes[1]};
      const result = itemAddedToCart(myPreviousState, itemToAdd, chosenSize.identifier);

      it ('adds it to the cart', () => {
        expect(result.cart.length).toStrictEqual(1);
      });

      it('has quantity as a property', () => {
        const item = result.cart[0];
        expect(item.quantity).toStrictEqual(1);
      });

      it ('uses the size identifier in cart', () => {
        const item = result.cart[0];
        expect(item.identifier).toStrictEqual(chosenSize.identifier);
      });

      it ('has the size as a top-level property', () => {
        const item = result.cart[0];
        expect(item.size).toStrictEqual(chosenSize.size);
      });

      it ('has display size as a top-level property', () => {
        const item = result.cart[0];
        expect(item.displaySize).toBeDefined();
      });

      it ('has the value as a top-level property', () => {
        const item = result.cart[0];
        expect(item.value).toStrictEqual(chosenSize.value);
      });
    });

    //
    // TODO: Events and bundle discounts
    //
    // How should they work in this brave new world?
    //
    // describe ('an event', () => {
    //   const itemToAdd = {
    //     identifier: 'a-core-event',
    //     category: 'bowling',
    //     determination: 'event',
    //   }
    //
    //   const myPreviousState = {...previousState};
    //   myPreviousState.availableItems.push({...itemToAdd})
    //
    //   const result = itemAddedToCart(myPreviousState, itemToAdd);
    //
    //   it ('adds it to the cart', () => {
    //     expect(result.cart.length).toStrictEqual(1);
    //     const item = result.cart[0];
    //     expect(item.quantity).toStrictEqual(1);
    //   });
    //
    //   describe ('with an eligible bundle discount', () => {
    //     const otherItem = {
    //       identifier: 'another-core-event',
    //       category: 'bowling',
    //       determination: 'event',
    //     };
    //
    //     const discountItem = {
    //       identifier: 'bundle_up',
    //       category: 'ledger',
    //       determination: 'bundle_discount',
    //       configuration: {
    //         events: [
    //           itemToAdd.identifier,
    //           otherItem.identifier,
    //         ],
    //       },
    //     };
    //
    //     describe ('bowler has the rest of the bundle in their cart', () => {
    //       // set up the other item being in the cart already
    //       const myPreviousState = {...previousState};
    //       myPreviousState.availableItems = {...previousState.availableItems};
    //       myPreviousState.availableItems[discountItem.identifier] = discountItem;
    //       myPreviousState.cart = [
    //         {
    //           ...otherItem,
    //           quantity: 1,
    //           addedToCart: true
    //         },
    //       ];
    //
    //       const result = itemAddedToCart(myPreviousState, itemToAdd);
    //
    //       it ('adds the bundle discount to the cart as well', () => {
    //         const bundleItemIndex = result.cart.findIndex(item => item.identifier === discountItem.identifier);
    //         expect(bundleItemIndex).toBeGreaterThanOrEqual(0);
    //       });
    //     });
    //
    //     describe ('bowler previously purchased the rest of the bundle', () => {
    //       // set up the other item having been purchased already
    //       const purchasedItem = {
    //         identifier: 'blahbitty-blah-a-purchase',
    //         purchasable_item_identifier: otherItem.identifier,
    //       }
    //
    //       const myPreviousState = {...previousState};
    //       myPreviousState.availableItems = {...previousState.availableItems};
    //       myPreviousState.availableItems[discountItem.identifier] = discountItem;
    //       myPreviousState.purchasedItems = [...previousState.purchasedItems];
    //       myPreviousState.purchasedItems = [purchasedItem];
    //
    //       const result = itemAddedToCart(myPreviousState, itemToAdd);
    //
    //       it ('adds the bundle discount to the cart as well', () => {
    //         const bundleItemIndex = result.cart.findIndex(item => item.identifier === discountItem.identifier);
    //         expect(bundleItemIndex).toBeGreaterThanOrEqual(0);
    //       });
    //     });
    //   });
    //
    //   describe ('with an applicable late fee', () => {
    //     const lateFeeItem = {
    //       identifier: 'tardy-to-the-party',
    //       category: 'ledger',
    //       determination: 'late_fee',
    //       refinement: 'event_linked',
    //       configuration: {
    //         event: itemToAdd.identifier,
    //         applies_at: new Date(Date.now() - 86400000),
    //       },
    //     };
    //
    //     describe ('when the tournament is in testing, with the late setting on', () => {
    //       const myPreviousState = {...previousState};
    //       myPreviousState.availableItems = {...previousState.availableItems};
    //       myPreviousState.availableItems[lateFeeItem.identifier] = lateFeeItem;
    //       myPreviousState.tournament = {
    //         testing_environment: {
    //           settings: {
    //             registration_period: {
    //               value: 'late',
    //             },
    //           },
    //         },
    //       };
    //
    //       const result = itemAddedToCart(myPreviousState, itemToAdd);
    //
    //       it ('adds the late-fee item to the cart', () => {
    //         const lateFeeItemIndex = result.cart.findIndex(item => item.identifier === lateFeeItem.identifier);
    //         expect(lateFeeItemIndex).toBeGreaterThanOrEqual(0);
    //       });
    //     });
    //
    //     describe ('when the tournament actually is in late registration', () => {
    //       const myPreviousState = {...previousState};
    //       myPreviousState.availableItems = {...previousState.availableItems};
    //       myPreviousState.availableItems[lateFeeItem.identifier] = lateFeeItem;
    //       myPreviousState.tournament = {...previousState.tournament};
    //
    //       const result = itemAddedToCart(myPreviousState, itemToAdd);
    //
    //       it ('adds the late-fee item to the cart', () => {
    //         const lateFeeItemIndex = result.cart.findIndex(item => item.identifier === lateFeeItem.identifier);
    //         expect(lateFeeItemIndex).toBeGreaterThanOrEqual(0);
    //       });
    //     });
    //   });
    // });
  });

  describe('the item is already in the cart', () => {
    describe('A bowling item', () => {
      describe('that is single_use', () => {
        const myPreviousState = {...previousState};
        myPreviousState.cart = [
          {
            identifier: 'woof',
            quantity: 1,
          }
        ];
        const itemToAdd = {
          identifier: 'woof',
          category: 'bowling',
          determination: 'single_use',
        }
        const result = itemAddedToCart(myPreviousState, itemToAdd);

          it ('makes no changes', () => {
            expect(result.cart.length).toEqual(myPreviousState.cart.length);
            const item = result.cart[0];
            expect(item.quantity).toStrictEqual(1);
          });
      });

      describe('multi-use', () => {
        const myPreviousState = {...previousState};
        myPreviousState.cart = [
          {
            identifier: 'woof',
            quantity: 15,
          }
        ];
        const itemToAdd = {
          identifier: 'woof',
          category: 'bowling',
          determination: 'multi_use',
        }
        const result = itemAddedToCart(myPreviousState, itemToAdd);

        it ('increments the existing quantity', () => {
          const resultItem = result.cart[0];
          expect(resultItem.quantity).toStrictEqual(16);
        });

        it ('does not change the number of distinct items in the cart', () => {
          expect(result.cart.length).toEqual(myPreviousState.cart.length);
        });
      });
    });

    describe('sanction', () => {
      const itemToAdd = {
        identifier: 'make-me-official',
        category: 'sanction',
        determination: 'igbo',
        addedToCart: true,
        quantity: 1,
      }
      const myPreviousState = {...previousState};
      myPreviousState.cart = [
        { ...itemToAdd },
      ];

      myPreviousState.availableItems.push({...itemToAdd});

      const result = itemAddedToCart(myPreviousState, itemToAdd);

      it ('makes no changes', () => {
        expect(result.cart.length).toStrictEqual(myPreviousState.cart.length);
        const item = result.cart[0];
        expect(item.quantity).toStrictEqual(1);
      });
    });

    describe('an event', () => {
      const itemToAdd = {
        identifier: 'some-core-event',
        category: 'bowling',
        determination: 'event',
      }
      const myPreviousState = {...previousState};
      myPreviousState.cart = [
        {
          ...itemToAdd,
          addedToCart: true,
          quantity: 1,
        },
      ];

      myPreviousState.availableItems.push({...itemToAdd});

      const result = itemAddedToCart(myPreviousState, itemToAdd);

      it ('makes no changes', () => {
        expect(result.cart.length).toStrictEqual(myPreviousState.cart.length);
        const item = result.cart[0];
        expect(item.quantity).toStrictEqual(1);
      });
    });

    describe('banquet', () => {
      const itemToAdd = {
        identifier: 'food-and-beverage',
        category: 'banquet',
      }
      const myPreviousState = {...previousState};
      myPreviousState.availableItems.push({...itemToAdd});
      myPreviousState.cart = [...previousState.cart];
      myPreviousState.cart.push({
        ...itemToAdd,
        quantity: 12,
      });

      const result = itemAddedToCart(myPreviousState, itemToAdd);

      it ('increments the existing quantity', () => {
        const resultItem = result.cart[0];
        expect(resultItem.quantity).toStrictEqual(13);
      });

      it ('does not change the number of distinct items in the cart', () => {
        expect(result.cart.length).toEqual(myPreviousState.cart.length);
      });
    });

    describe('raffle', () => {
      const itemToAdd = {
        category: 'raffle',
        identifier: 'the-house-always-wins',
        quantity: 3,
      }
      const myPreviousState = {...previousState};
      myPreviousState.availableItems.push({...itemToAdd});
      myPreviousState.cart = [...previousState.cart];
      myPreviousState.cart.push(itemToAdd);

      const result = itemAddedToCart(myPreviousState, itemToAdd);

      it ('increments the existing quantity', () => {
        const resultItem = result.cart[0];
        expect(resultItem.quantity).toStrictEqual(itemToAdd.quantity + 1);
      });

      it ('does not change the number of distinct items in the cart', () => {
        expect(result.cart.length).toEqual(myPreviousState.cart.length);
      });
    });

    describe('product - general', () => {
      const itemToAdd = {
        identifier: 'something-to-buy',
        category: 'product',
        determination: 'general',
      }
      const myPreviousState = {...previousState};
      myPreviousState.availableItems.push(itemToAdd);
      myPreviousState.cart = [...previousState.cart];
      myPreviousState.cart.push({
        ...itemToAdd,
        quantity: 12,
      });

      const result = itemAddedToCart(myPreviousState, itemToAdd);

      it ('increments the existing quantity', () => {
        const resultItem = result.cart[0];
        expect(resultItem.quantity).toStrictEqual(13);
      });

      it ('does not change the number of distinct items in the cart', () => {
        expect(result.cart.length).toEqual(myPreviousState.cart.length);
      });
    });

    describe('product - apparel - not sized', () => {
      const itemToAdd = {
        identifier: 'something-to-buy',
        category: 'product',
        determination: 'apparel',
        refinement: 'not-sized', // not a real refinement, for the sake of testing
        size: "Ah, but I do have a size",
      };

      const myPreviousState = {...previousState};
      myPreviousState.availableItems.push(itemToAdd);
      myPreviousState.cart = [...previousState.cart];
      myPreviousState.cart.push({
        ...itemToAdd,
        quantity: 7,
      });

      const result = itemAddedToCart(myPreviousState, itemToAdd);

      it ('increments the existing quantity', () => {
        const resultItem = result.cart[0];
        expect(resultItem.quantity).toStrictEqual(8);
      });

      it ('does not change the number of distinct items in the cart', () => {
        expect(result.cart.length).toEqual(myPreviousState.cart.length);
      });
    });

    describe('product - apparel - adding another', () => {
      const chosenSize = {
        identifier: 'in-a-medium',
        size: 'men.m',
        displaySize: 'Medium!',
        parentIdentifier: 'something-to-wear',
      };
      const itemToAdd = {
        identifier: 'something-to-wear',
        category: 'product',
        determination: 'apparel',
        refinement: 'sized',
        sizes: [
          {
            identifier: 'in-a-small',
            size: 'men.s',
            displaySize: 'Small!',
            parentIdentifier: 'something-to-wear',
          },
          chosenSize,
          {
            identifier: 'in-a-large',
            size: 'men.l',
            displaySize: 'Large!',
            parentIdentifier: 'something-to-wear',
          },
        ],
        value: 39,
      }

      const myPreviousState = {...previousState};
      const sizeIdentifier = chosenSize.identifier;
      myPreviousState.availableItems.push(itemToAdd);
      myPreviousState.cart = [...previousState.cart];
      myPreviousState.cart.push(
        {
          ...itemToAdd.sizes[0],
          quantity: 8,
        },
        {
          ...chosenSize,
          quantity: 3,
        },
      );

      const result = itemAddedToCart(myPreviousState, itemToAdd, sizeIdentifier);

      it ('increments the existing quantity for the right one', () => {
        const resultItem = result.cart[1];
        expect(resultItem.quantity).toStrictEqual(4);
      });

      it ('does not change the quantity of the other one(s)', () => {
        const resultItem = result.cart[0];
        expect(resultItem.quantity).toStrictEqual(8);
      });

      it ('does not change the number of distinct items in the cart', () => {
        expect(result.cart.length).toEqual(myPreviousState.cart.length);
      });
    });
  });
});
