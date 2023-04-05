// import * as actionTypes from '../../../src/store/actions/actionTypes';
// import {commerceReducer} from "../../../src/store/commerceReducer";
//
// describe('item added to cart', () => {
//   // Prerequisites:
//   // state:
//   //  - cart is defined, and contains a list of added items, possibly empty. Each cart item includes a quantity
//   //  - availableItems is a map of identifier to item details, possibly empty
//   //  - purchasedItems is a list of items, possibly empty -- passed as a function arg when item.determination is 'event'
//   //  - tournament -- passed as a function arg when item.determination is 'event'
//   // Postrequisites:
//   // - The item in the cart contains an updated quantity
//   // - The item in "available items" is marked as added to cart -- so that the UI can indicate as much
//
//   const action = {
//     type: actionTypes.ITEM_ADDED_TO_CART,
//     item: {},
//   }
//
//   const previousState = {
//     cart: [],
//     availableItems: {},
//     purchasedItems: [],
//     tournament: {},
//   }
//
//   it ('works', () => {
//     const result = commerceReducer(previousState, action);
//     expect(result.cart.length).toStrictEqual(1);
//   });
//
//   it ('adds a quantity of 1', () => {
//     const result = commerceReducer(previousState, action);
//     const resultItem = result.cart[0];
//     expect(resultItem.quantity).toStrictEqual(1);
//   });
//
//   describe('the item is already in the cart', () => {
//     describe('multi-use', () => {
//       const myAction = {...action};
//       const myPreviousState = {...previousState};
//       myPreviousState.cart = [
//         {
//           identifier: 'woof',
//           quantity: 15,
//         }
//       ];
//       myAction.item = {
//         identifier: 'woof',
//         determination: 'multi_use',
//       }
//       const result = commerceReducer(myPreviousState, myAction);
//
//       it ('increments the existing quantity', () => {
//         const resultItem = result.cart[0];
//         expect(resultItem.quantity).toStrictEqual(16);
//       });
//
//       it ('does not change the number of distinct items in the cart', () => {
//         expect(result.cart.length).toEqual(myPreviousState.cart.length);
//       });
//     });
//     describe('product - general', () => {
//       const myAction = {...action};
//       const myPreviousState = {...previousState};
//       myPreviousState.cart = [
//         {
//           identifier: 'a-good-thing',
//           quantity: 3,
//         }
//       ];
//       myAction.item = {
//         identifier: 'a-good-thing',
//         category: 'product',
//         determination: 'general;'
//       }
//       const result = commerceReducer(myPreviousState, myAction);
//
//       it ('increments the existing quantity', () => {
//         const resultItem = result.cart[0];
//         expect(resultItem.quantity).toStrictEqual(4);
//       });
//
//       it ('does not change the number of distinct items in the cart', () => {
//         expect(result.cart.length).toEqual(myPreviousState.cart.length);
//       });
//     });
//     describe('product - apparel - adding another', () => {
//       const myAction = {...action};
//       const myPreviousState = {...previousState};
//       myPreviousState.cart = [
//         {
//           identifier: 'a-large-shirt',
//           quantity: 3,
//         }
//       ];
//       myAction.item = {
//         identifier: 'a-large-shirt',
//         category: 'product',
//         determination: 'apparel',
//       }
//       const result = commerceReducer(myPreviousState, myAction);
//
//       it ('increments the existing quantity', () => {
//         const resultItem = result.cart[0];
//         expect(resultItem.quantity).toStrictEqual(4);
//       });
//
//       it ('does not change the number of distinct items in the cart', () => {
//         expect(result.cart.length).toEqual(myPreviousState.cart.length);
//       });
//     });
//
//     describe('single-use', () => {
//       const myAction = {...action};
//       const myPreviousState = {...previousState};
//       myPreviousState.cart = [
//         {
//           identifier: 'woof',
//           determination: 'single_use',
//           quantity: 1,
//         }
//       ];
//       myAction.item = {
//         identifier: 'woof',
//         determination: 'single_use',
//       }
//
//       const result = commerceReducer(myPreviousState, myAction);
//       it ('makes no changes', () => {
//         expect(result.cart.length).toEqual(myPreviousState.cart.length);
//         const item = result.cart[0];
//         expect(item.quantity).toStrictEqual(1);
//       });
//     });
//     describe('sanction', () => {
//       const myAction = {...action};
//       const myPreviousState = {...previousState};
//       myPreviousState.cart = [
//         {
//           identifier: 'woof',
//           category: 'sanction',
//           determination: 'igbo',
//           quantity: 1,
//         }
//       ];
//       myAction.item = {
//         identifier: 'woof',
//         category: 'sanction',
//         determination: 'igbo',
//       }
//
//       const result = commerceReducer(myPreviousState, myAction);
//       it ('makes no changes', () => {
//         expect(result.cart.length).toEqual(myPreviousState.cart.length);
//         const item = result.cart[0];
//         expect(item.quantity).toStrictEqual(1);
//       });
//     });
//   });
//
//   describe ('the item is not yet in the cart', () => {
//     describe ('a sanction item', () => {
//       const myAction = {...action};
//       myAction.item = {
//         identifier: 'meow',
//         category: 'sanction',
//         determination: 'some_org',
//       };
//
//       it ('adds it to the cart', () => {
//         const result = commerceReducer(previousState, myAction);
//         expect(result.cart.length).toStrictEqual(1);
//         const item = result.cart[0];
//         expect(item.quantity).toStrictEqual(1);
//       });
//
//       it ('marks the item in availableItems as added to cart', () => {
//         const result = commerceReducer(previousState, myAction);
//         const item = result.availableItems[myAction.item.identifier];
//         expect(item.addedToCart).toBeDefined();
//         expect(item.addedToCart).toBeTruthy();
//       });
//     });
//     describe ('a single-use item', () => {
//       const myAction = {...action};
//       myAction.item = {
//         identifier: 'meow',
//         determination: 'single_use',
//       };
//
//       it ('adds it to the cart', () => {
//         const result = commerceReducer(previousState, myAction);
//         expect(result.cart.length).toStrictEqual(1);
//         const item = result.cart[0];
//         expect(item.quantity).toStrictEqual(1);
//       });
//
//       it ('marks the item in availableItems as added to cart', () => {
//         const result = commerceReducer(previousState, myAction);
//         const item = result.availableItems[myAction.item.identifier];
//         expect(item.addedToCart).toBeDefined();
//         expect(item.addedToCart).toBeTruthy();
//       });
//
//       describe ('a division item', () => {
//         const divAction = {...myAction};
//         divAction.item = {
//           ...myAction.item,
//           refinement: 'division',
//           name: 'a division-based item',
//           identifier: 'dolly',
//         };
//
//         // they must have the same name
//         const divisionItems = {
//           abba: {
//             determination: 'single_use',
//             refinement: 'division',
//             identifier: 'abba',
//             name: 'a division-based item',
//           },
//           beyonce: {
//             determination: 'single_use',
//             refinement: 'division',
//             identifier: 'beyonce',
//             name: 'a division-based item',
//           },
//           carlyrae: {
//             determination: 'single_use',
//             refinement: 'division',
//             identifier: 'carlyrae',
//             name: 'a division-based item',
//           },
//           dolly: {
//             determination: 'single_use',
//             refinement: 'division',
//             identifier: 'dolly',
//             name: 'a division-based item',
//           },
//         }
//
//         const myPreviousState = {
//           ...previousState,
//           availableItems: {
//             ...previousState.availableItems,
//             ...divisionItems,
//           },
//           purchasedItems: [...previousState.purchasedItems],
//         };
//
//         it ('adds it to the cart', () => {
//           const result = commerceReducer(myPreviousState, divAction);
//           expect(result.cart.length).toBe(1);
//           const item = result.cart[0];
//           expect(item.quantity).toBe(1);
//         });
//
//         it ('marks the other items in the division as unavailable', () => {
//           const result = commerceReducer(myPreviousState, divAction);
//           const availableDivisionItems = Object.values(result.availableItems).filter(item => item.name === 'a division-based item');
//           expect(availableDivisionItems.length).toBe(Object.keys(divisionItems).length);
//           const anyNotAddedToCart = availableDivisionItems.some(item => !item.addedToCart);
//           expect(anyNotAddedToCart).toBeFalsy();
//         });
//       });
//     });
//
//     describe ('a multi-use item', () => {
//       const myAction = {...action};
//       myAction.item = {
//         identifier: 'quack',
//         determination: 'multi_use',
//       };
//
//       it ('adds it to the cart', () => {
//         const result = commerceReducer(previousState, myAction);
//         expect(result.cart.length).toBe(1);
//         const item = result.cart[0];
//         expect(item.quantity).toBe(1);
//       });
//     });
//
//     describe ('a general product', () => {
//       const myAction = {...action};
//       myAction.item = {
//         identifier: 'something-to-buy',
//         category: 'product',
//         determination: 'general',
//       };
//
//       it ('adds it to the cart', () => {
//         const result = commerceReducer(previousState, myAction);
//         expect(result.cart.length).toBe(1);
//         const item = result.cart[0];
//         expect(item.quantity).toBe(1);
//       });
//     });
//
//     describe ('a product with a size', () => {
//       const myAction = {...action};
//       myAction.item = {
//         identifier: 'something-to-wear',
//         category: 'product',
//         determination: 'apparel',
//         size: 'unisex.m,',
//       };
//
//       it ('adds it to the cart', () => {
//         const result = commerceReducer(previousState, myAction);
//         expect(result.cart.length).toBe(1);
//         const item = result.cart[0];
//         expect(item.quantity).toBe(1);
//       });
//     });
//
//     // describe('a product with a separate size identifier', () => {
//     //   const availableItem = {
//     //     identifier: 'something-to-wear',
//     //     category: 'product',
//     //     determination: 'apparel',
//     //     refinement: 'sized',
//     //     sizes: [
//     //       {
//     //         identifier: 'in-a-small',
//     //         size: 'men.s',
//     //         displaySize: 'Small!',
//     //       },
//     //       {
//     //         identifier: 'in-a-medium',
//     //         size: 'men.m',
//     //         displaySize: 'Medium!',
//     //       },
//     //       {
//     //         identifier: 'in-a-large',
//     //         size: 'men.l',
//     //         displaySize: 'Large!',
//     //       },
//     //     ],
//     //     value: 39,
//     //   }
//     //   const myAction = {
//     //     ...action,
//     //     item: availableItem,
//     //     sizeIdentifier: 'in-a-medium',
//     //   };
//     //
//     //   const resultingItem = {
//     //     ...availableItem,
//     //     identifier: 'in-a-medium',
//     //     parent: availableItem.identifier,
//     //     quantity: 1,
//     //   }
//     //
//     //   it ('adds 1 to the cart', () => {
//     //     const result = commerceReducer(previousState, myAction);
//     //     expect(result.cart.length).toBe(1);
//     //     const item = result.cart[0];
//     //     expect(item.quantity).toBe(1);
//     //   });
//     //
//     //   it ('swaps out the parent identifier for the size identifier', () => {
//     //     const result = commerceReducer(previousState, myAction);
//     //     const item = result.cart[0];
//     //     expect(item.identifier).toStrictEqual('in-a-medium');
//     //   });
//     //
//     //   it ('sets the parent identifier property', () => {
//     //     const result = commerceReducer(previousState, myAction);
//     //     const item = result.cart[0];
//     //     expect(item.parent).toStrictEqual(availableItem.identifier);
//     //   });
//     //
//     //   it ('sets the size in the item configuraiton', () => {
//     //     const result = commerceReducer(previousState, myAction);
//     //     const item = result.cart[0];
//     //     expect(item.configuration.size).toStrictEqual('men.m');
//     //   });
//     //
//     //   it ('sets the display size in the item configuration', () => {
//     //     const result = commerceReducer(previousState, myAction);
//     //     const item = result.cart[0];
//     //     expect(item.configuration.displaySize).toStrictEqual("Medium!");
//     //   });
//     // });
//
//     describe ('an event', () => {
//       const myAction = {...action};
//       myAction.item = {
//         identifier: 'woof',
//         determination: 'event',
//       };
//
//       it ('behaves like a ledger item', () => {
//         const result = commerceReducer(previousState, myAction);
//         expect(result.cart.length).toEqual(1);
//         const item = result.cart[0];
//         expect(item.quantity).toEqual(1);
//       });
//
//       describe ('with an eligible bundle discount', () => {
//         const otherItem = {
//           identifier: 'moo',
//           determination: 'event',
//         };
//
//         const discountItem = {
//           identifier: 'bundle_up',
//           category: 'ledger',
//           determination: 'bundle_discount',
//           configuration: {
//             events: [
//               myAction.item.identifier,
//               otherItem.identifier,
//             ],
//           },
//         };
//
//         describe ('bowler has the rest of the bundle in their cart', () => {
//           // set up the other item being in the cart already
//           const myPreviousState = {...previousState};
//           myPreviousState.availableItems = {...previousState.availableItems};
//           myPreviousState.availableItems[discountItem.identifier] = discountItem;
//           myPreviousState.cart = [otherItem];
//
//           it ('adds the bundle discount to the cart as well', () => {
//             const result = commerceReducer(myPreviousState, myAction);
//             const bundleItemIndex = result.cart.findIndex(item => item.identifier === discountItem.identifier);
//             expect(bundleItemIndex).toBeGreaterThanOrEqual(0);
//           });
//         });
//
//         describe ('bowler previously purchased the rest of the bundle', () => {
//           // set up the other item having been purchased already
//           const purchasedItem = {
//             identifier: 'blahbitty-blah',
//             purchasable_item_identifier: otherItem.identifier,
//           }
//
//           const myPreviousState = {...previousState};
//           myPreviousState.availableItems = {...previousState.availableItems};
//           myPreviousState.availableItems[discountItem.identifier] = discountItem;
//           myPreviousState.purchasedItems = [...previousState.purchasedItems];
//           myPreviousState.purchasedItems = [purchasedItem];
//
//           it ('adds the bundle discount to the cart as well', () => {
//             const result = commerceReducer(myPreviousState, myAction);
//             const bundleItemIndex = result.cart.findIndex(item => item.identifier === discountItem.identifier);
//             expect(bundleItemIndex).toBeGreaterThanOrEqual(0);
//           });
//         });
//       });
//
//       describe ('with an applicable late fee', () => {
//         const lateFeeItem = {
//           identifier: 'tardy-to-the-party',
//           category: 'ledger',
//           determination: 'late_fee',
//           refinement: 'event_linked',
//           configuration: {
//             event: 'woof',
//             applies_at: new Date(Date.now() - 86400000),
//           },
//         };
//
//         describe ('when the tournament is in testing, with the late setting on', () => {
//           const myPreviousState = {...previousState};
//           myPreviousState.availableItems = {...previousState.availableItems};
//           myPreviousState.availableItems[lateFeeItem.identifier] = lateFeeItem;
//           myPreviousState.tournament = {
//             testing_environment: {
//               settings: {
//                 registration_period: {
//                   value: 'late',
//                 },
//               },
//             },
//           };
//
//           it ('adds the late-fee item to the cart', () => {
//             const result = commerceReducer(myPreviousState, myAction);
//             const lateFeeItemIndex = result.cart.findIndex(item => item.identifier === lateFeeItem.identifier);
//             expect(lateFeeItemIndex).toBeGreaterThanOrEqual(0);
//           });
//         });
//
//         describe ('when the tournament actually is in late registration', () => {
//           const myPreviousState = {...previousState};
//           myPreviousState.availableItems = {...previousState.availableItems};
//           myPreviousState.availableItems[lateFeeItem.identifier] = lateFeeItem;
//           myPreviousState.tournament = {...previousState.tournament};
//
//           it ('adds the late-fee item to the cart', () => {
//             const result = commerceReducer(myPreviousState, myAction);
//             const lateFeeItemIndex = result.cart.findIndex(item => item.identifier === lateFeeItem.identifier);
//             expect(lateFeeItemIndex).toBeGreaterThanOrEqual(0);
//           });
//         });
//       });
//     });
//   });
// });
