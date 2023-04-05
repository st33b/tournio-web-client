// The idea is for this file to encapsulate all the logic surrounding adding
// a purchasable item to the cart, regardless of the nature of the item.

// Items' natures can be described by:
// category
//   -> determination
//     -> refinement

// ledger
//   -> entry_fee
//   -> late_fee
//        -> event_linked
//   -> early_discount
//   -> bundle_discount
//   -> discount_expiration

// bowling
//   -> single_use
//        -> division
//   -> multi_use
//   -> event
//        -> single
//        -> double
//        -> trio
//        -> team

// product
//   -> general
//   -> apparel
//        -> sized

// sanction
//   -> igbo
//   -> usbc (TODO: not currently defined in API code; should it be?)

// TODO: migrate banquet away from multi_use in favor of being its own category
// banquet (currently it's treated like a multi_use item, but it should not be

// TODO: Planned
// raffle
//   -> denomination

// TODO: Planned
// bracket
//   -> handicap
//        -> single
//        -> double
//        -> trio
//        -> team
//   -> scratch
//        -> single
//        -> double
//        -> trio
//        -> team

import {devConsoleLog, updateObject} from "../utils";

export const itemAddedToCart = (currentState, itemToAdd, sizeIdentifier = null) => {
  switch(itemToAdd.category) {
    case 'ledger':
      return handleAsLedgerItem(currentState, itemToAdd);
    case 'bowling':
      return handleAsBowlingItem(currentState, itemToAdd);
    case 'sanction':
      return handleAsSanctionItem(currentState, itemToAdd);
    case 'banquet':
      return handleAsBanquet(currentState, itemToAdd);
    case 'product':
      return handleAsProduct(currentState, itemToAdd, sizeIdentifier);
    default:
      devConsoleLog("Tried to add an unrecognized item to the cart.", itemToAdd);
      break;
  }
  return currentState;
}

const handleAsLedgerItem = (prevState, itemToAdd) => {
  devConsoleLog("handleAsLedgerItem :: We don't do this!");
}

const handleAsBowlingItem = (prevState, itemToAdd) => {
  if (['single_use', 'event'].includes(itemToAdd.determination)) {
    return handleSingleton(prevState, itemToAdd);

    // TODO: bundle discount and late fees related to events.
  }
  return handlePossiblyMany(prevState, itemToAdd);
}

const handleAsSanctionItem = (prevState, itemToAdd) => {
  return handleSingleton(prevState, itemToAdd);
}

const handleAsProduct = (prevState, itemToAdd, sizeIdentifier) => {
  console.log("Yeah it's a product");
  if (itemToAdd.refinement !== 'sized') {
    return handlePossiblyMany(prevState, itemToAdd);
  }
  console.log("... and it's sized.");
  // Now we get to the heart of it. itemToAdd looks something like this:
  // {
  //   identifier: 'something-to-wear',
  //   category: 'product',
  //   determination: 'apparel',
  //   refinement: 'sized',
  //   name: 'Name of the thing',
  //   sizes: [
  //   {
  //     identifier: 'in-a-small',
  //     size: 'men.s',
  //     displaySize: 'Small!',
  //     parentIdentifier: 'something-to-wear',
  //     quantity: 0,
  //   },
  //   {
  //     identifier: 'in-a-medium',
  //     size: 'men.m',
  //     displaySize: 'Medium!',
  //     parentIdentifier: 'something-to-wear',
  //     quantity: 2,
  //   },
  //   {
  //     identifier: 'in-a-large',
  //     size: 'men.l',
  //     displaySize: 'Large!',
  //     parentIdentifier: 'something-to-wear',
  //     quantity: 1,
  //   },
  // ],
  //   value: 39,
  // }

  // In the cart, treat it as a top-level item, so that we have a different quantity
  // for each distinct size. The presence of parentIdentifier may come in handy for
  // removing it later.

  // this is similar to handlePossiblyMany, in terms of algorithm, but the
  // resulting collection doesn't affect availableItems, and it looks through
  // itemToAdd.sizes for a match.

  const cartItemIndex = prevState.cart.findIndex(({identifier}) => identifier === sizeIdentifier);
  console.log("I found one already there?", cartItemIndex >= 0);
  const newQuantity = cartItemIndex >= 0 ? prevState.cart[cartItemIndex].quantity + 1 : 1;

  const prevApparelItem = cartItemIndex >= 0 ? prevState.cart[cartItemIndex] : itemToAdd.sizes.find(({identifier}) => identifier === sizeIdentifier);

  const addedApparelItem = updateObject(prevApparelItem, {
    quantity: newQuantity,
  });
  let updatedCart;
  if (cartItemIndex >= 0) {
    // Just replace the apparel item in the cart with the updated version
    updatedCart = [...prevState.cart];
    updatedCart[cartItemIndex] = addedApparelItem;
  } else {
    // Add the apparel item to the cart
    updatedCart = prevState.cart.concat(addedApparelItem);
  }

  return updateObject(prevState, {
    cart: updatedCart,
  });
}

const handleAsBanquet = (prevState, itemToAdd) => {
  return handlePossiblyMany(prevState, itemToAdd);
}

const handlePossiblyMany = (prevState, itemToAdd) => {
  const newItemIdentifier = itemToAdd.identifier;
  const cartItemIndex = prevState.cart.findIndex(({identifier}) => identifier === newItemIdentifier);
  const prevQuantity = cartItemIndex >= 0 ? prevState.cart[cartItemIndex].quantity : 0;
  const newQuantity = prevQuantity + 1;

  const addedItem = updateObject(itemToAdd, {
    quantity: newQuantity,
  });

  let updatedCart;
  const updatedAvailableItems = {...prevState.availableItems};
  if (newQuantity === 1) {
    updatedCart = prevState.cart.concat(addedItem);
    updatedAvailableItems[newItemIdentifier] = addedItem;
  } else {
    updatedCart = prevState.cart.slice(0);
    updatedCart[cartItemIndex] = addedItem;
  }

  return updateObject(prevState, {
    cart: updatedCart,
    availableItems: updatedAvailableItems,
  })
}

const handleSingleton = (prevState, itemToAdd) => {
  const newItemIdentifier = itemToAdd.identifier;
  const cartItemIndex = prevState.cart.findIndex(({identifier}) => identifier === newItemIdentifier);

  // There is one already, so we do nothing.
  if (cartItemIndex >= 0) {
    return prevState;
  }

  const addedItem = updateObject(itemToAdd, {
    quantity: 1,
    addedToCart: true,
  });

  const updatedAvailableItems = {...prevState.availableItems};
  updatedAvailableItems[newItemIdentifier] = addedItem;

  const updatedCart = prevState.cart.concat(addedItem);
  const availableItemsWithUpdatedDivisions = handleDivisionItem(updatedAvailableItems, addedItem);

  return updateObject(prevState, {
    cart: updatedCart,
    availableItems: availableItemsWithUpdatedDivisions,
  });
}

const handleDivisionItem = (previousItems, itemToAdd) => {
  if (itemToAdd.refinement !== 'division') {
    return previousItems;
  }

  const availableItems = {...previousItems};
  for (const identifier in availableItems) {
    // skip it if we're looking in the mirror
    if (identifier === itemToAdd.identifier) {
      continue;
    }

    // We're only interested in division things.
    // Technically, single-use as well, but we don't currently support multi-use division items.
    // (Would there be two different kinds of Scratch Masters?)
    if (availableItems[identifier].refinement !== 'division') {
      continue;
    }

    // Every item with the same name is now considered added-to-cart.
    // Because we differentiate between Division things based on the name.
    // Seems kinda fragile, but it works for now.
    if (availableItems[identifier].name === itemToAdd.name) {
      availableItems[identifier].addedToCart = true;
    }
  }
  return availableItems;
}
