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
//   -> denominatin

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

import {updateObject} from "../utils";

const handleAsLedgerItem = (prevState, itemToAdd) => {

}

const handleAsBowlingItem = (prevState, itemToAdd) => {
  if (['single_use', 'event'].includes(item.determination)) {
    return handleSingleton(prevState, itemToAdd);
  }
  return handlePossiblyMany(prevState, itemToAdd);
}

const handleAsSanctionItem = (prevState, itemToAdd) => {
  return handleSingleton(prevState, itemToAdd);
}

const handleAsProduct = (prevState, itemToAdd, sizeIdentifier) => {
  if (itemToAdd.determination !== 'sized') {
    return handlePossiblyMany(prevState, itemToAdd);
  }
  // Now we get to the heart of it.
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
  const identifier = itemToAdd.identifier;
  const cartItemIndex = prevState.cart.findIndex(i => i.identifier === identifier);

  // There is one already, so we do nothing.
  if (cartItemIndex >= 0) {
    return prevState;
  }

  const addedItem = updateObject(itemToAdd, {
    quantity: 1,
    addedToCart: true,
  });

  const updatedAvailableItems = {...prevState.availableItems};
  updatedAvailableItems[identifier] = addedItem;

  const updatedCart = prevState.cart.concat(addedItem);
  const availableItemsWithUpdatedDivisions = handleDivisionItem(updatedAvailableItems, addedItem);

  return updateObject(prevState, {
    cart: updatedCart,
    availableItems: availableItemsWithUpdatedDivisions,
  });
}

const handleDivisionItem = (previousItems, itemToAdd) => {
  const itemsInCart = {...previousItems};
  for (const identifier in {...itemsInCart}) {
    // skip it if we're looking in the mirror
    if (identifier === itemToAdd.identifier) {
      continue;
    }

    // We're only interested in division things.
    // Technically, single-use as well, but we don't currently support multi-use division items.
    // (Would there be two different kinds of Scratch Masters?)
    if (itemsInCart[identifier].refinement !== 'division') {
      continue;
    }

    // Every item with the same name is now considered added-to-cart.
    // Because we differentiate between Division things based on the name.
    // Seems kinda fragile, but it works for now.
    if (itemsInCart[identifier].name === itemToAdd.name) {
      itemsInCart[identifier].addedToCart = true;
    }

    return itemsInCart;
  }
}
