// The idea is for this file to encapsulate all the logic surrounding adding
// a purchasable item to the cart, regardless of the nature of the item.

// Items' natures can be described by:
// category
//   -> determination
//     -> refinement

//
// these items cannot be added to the cart; they're automatic
//
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

// banquet

// raffle

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

import {devConsoleLog, updateObject} from "../../utils";
import {compareAsc} from "date-fns";
import availableItems from "../../components/Commerce/AvailableItems/AvailableItems";

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
    case 'raffle':
      return handleAsRaffle(currentState, itemToAdd);
    case 'product':
      return handleAsProduct(currentState, itemToAdd, sizeIdentifier);
    default:
      devConsoleLog("Tried to add an unrecognized item to the cart.", itemToAdd);
      break;
  }
  return currentState;
}

const handleAsLedgerItem = (previousState, itemToAdd) => {
  return handleAsSingleton(previousState, itemToAdd);
}

const handleAsBowlingItem = (previousState, itemToAdd) => {
  if (['single_use', 'event'].includes(itemToAdd.determination)) {
    return tryAddingLateFee(
      tryAddingBundleDiscount(
        handleAsDivisionItem(
          handleAsSingleton(
            previousState,
            itemToAdd
          ),
          itemToAdd
        ),
        itemToAdd
      ),
      itemToAdd
    );
  }
  return handleAsPossiblyMany(previousState, itemToAdd);
}

const handleAsSanctionItem = (previousState, itemToAdd) => {
  return handleAsSingleton(previousState, itemToAdd);
}

const handleAsProduct = (previousState, itemToAdd, sizeIdentifier) => {
  if (itemToAdd.refinement !== 'sized') {
    return handleAsPossiblyMany(previousState, itemToAdd);
  }
  // Now we get to the heart of it. itemToAdd looks something like this (with a few other
  // properties in the elements of sizes):
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
  //     quantity: 0,
  //   },
  //   {
  //     identifier: 'in-a-large',
  //     size: 'men.l',
  //     displaySize: 'Large!',
  //     parentIdentifier: 'something-to-wear',
  //     quantity: 0,
  //   },
  // ],
  //   value: 39,
  // }

  // In the cart, treat it as a top-level item, so that we have a different quantity
  // for each distinct size. The presence of parentIdentifier may come in handy for
  // removing it later.

  // this is similar to handleAsPossiblyMany, in terms of algorithm, but the
  // resulting collection doesn't affect availableItems, and it looks through
  // itemToAdd.sizes for a match.

  const cartItemIndex = previousState.cart.findIndex(({identifier}) => identifier === sizeIdentifier);

  let prevApparelItem, newQuantity;
  if (cartItemIndex >= 0) {
    prevApparelItem = previousState.cart[cartItemIndex];
    newQuantity = previousState.cart[cartItemIndex].quantity + 1
  } else {
    prevApparelItem = itemToAdd.configuration.sizes.find(({identifier}) => identifier === sizeIdentifier);
    newQuantity = 1;
  }

  const addedApparelItem = updateObject(prevApparelItem, {
    quantity: newQuantity,
  });
  let updatedCart;
  if (cartItemIndex >= 0) {
    // Just replace the apparel item in the cart with the updated version
    updatedCart = [...previousState.cart];
    updatedCart[cartItemIndex] = addedApparelItem;
  } else {
    // Add the apparel item to the cart
    updatedCart = previousState.cart.concat(addedApparelItem);
  }

  return updateObject(previousState, {
    cart: updatedCart,
  });
}

const handleAsBanquet = (previousState, itemToAdd) => {
  return handleAsPossiblyMany(previousState, itemToAdd);
}

const handleAsRaffle = (previousState, itemToAdd) => {
  return handleAsPossiblyMany(previousState, itemToAdd);
}

const handleAsPossiblyMany = (previousState, itemToAdd) => {
  const newItemIdentifier = itemToAdd.identifier;
  const cartItemIndex = previousState.cart.findIndex(({identifier}) => identifier === newItemIdentifier);
  const prevQuantity = cartItemIndex >= 0 ? previousState.cart[cartItemIndex].quantity : 0;
  const newQuantity = prevQuantity + 1;

  const addedItem = updateObject(itemToAdd, {
    quantity: newQuantity,
  });

  let updatedCart;
  const updatedAvailableItems = [...previousState.availableItems];
  if (newQuantity === 1) {
    updatedCart = previousState.cart.concat(addedItem);
    const availableItemIndex = updatedAvailableItems.findIndex(({identifier}) => identifier === addedItem.identifier);
    updatedAvailableItems[availableItemIndex] = addedItem;
  } else {
    updatedCart = [...previousState.cart];
    updatedCart[cartItemIndex] = addedItem;
  }

  return updateObject(previousState, {
    cart: updatedCart,
    availableItems: updatedAvailableItems,
  })
}

const handleAsSingleton = (previousState, itemToAdd) => {
  const newItemIdentifier = itemToAdd.identifier;
  const cartItemIndex = previousState.cart.findIndex(({identifier}) => identifier === newItemIdentifier);

  // There is one already, so we do nothing.
  if (cartItemIndex >= 0) {
    return previousState;
  }

  const addedItem = updateObject(itemToAdd, {
    quantity: 1,
    addedToCart: true,
  });

  const updatedAvailableItems = [...previousState.availableItems];
  const availableItemIndex = updatedAvailableItems.findIndex(({identifier}) => identifier === addedItem.identifier);
  updatedAvailableItems[availableItemIndex] = addedItem;

  const updatedCart = previousState.cart.concat(addedItem);

  return updateObject(previousState, {
    cart: updatedCart,
    availableItems: updatedAvailableItems,
  });
}

const handleAsDivisionItem = (previousState, itemToAdd) => {
  const availableItems = [...previousState.availableItems];
  if (itemToAdd.refinement !== 'division') {
    return previousState;
  }

  availableItems.forEach(item => {
    // skip it if we're looking in the mirror
    if (item.identifier === itemToAdd.identifier) {
      return;
    }

    // We're only interested in division things.
    // Technically, single-use as well, but we don't currently support multi-use division items.
    // (Would there be two different kinds of Scratch Masters?)
    if (item.refinement !== 'division') {
      return;
    }

    // Every item with the same name is now considered added-to-cart.
    // Because we differentiate between Division things based on the name.
    // Seems kinda fragile, but it works for now.
    if (item.name === itemToAdd.name) {
      // This assumes that changes to item will stick...
      item.addedToCart = true;
    }
  });
  return updateObject(previousState, {
    availableItems: availableItems,
  });
}

const tryAddingBundleDiscount = (previousState, itemToAdd) => {
  if (itemToAdd.determination !== 'event') {
    return previousState;
  }

  const discountItem = eligibleBundleDiscount(previousState);
  if (!discountItem) {
    return previousState;
  }

  const stateWithDiscountAdded = itemAddedToCart(previousState, discountItem);
  return updateObject(previousState, {
    cart: stateWithDiscountAdded.cart,
    availableItems: stateWithDiscountAdded.availableItems,
  });
}

const eligibleBundleDiscount = (previousState) => {
  const {availableItems, cart, purchasedItems} = previousState;

  const cartItemIdentifiers = cart.map(item => item.identifier);
  const purchasedItemIdentifiers = purchasedItems.map(item => item.purchasable_item_identifier);
  const itemsToConsider = cartItemIdentifiers.concat(purchasedItemIdentifiers);
  return availableItems.find(item => {
    if (item.category !== 'ledger' || item.determination !== 'bundle_discount' || item.addedToCart) {
      return false;
    }
    // intersect the cart+purchased item identifiers with the ones in the bundle_discount's configuration.events property
    const intersection = itemsToConsider.filter(i => item.configuration.events.includes(i));

    // if the intersection is the same size as the configuration.events property, then we're eligible for the discount!
    return intersection.length === item.configuration.events.length;
  });
}

const tryAddingLateFee = (previousState, itemToAdd) => {
  if (itemToAdd.determination !== 'event') {
    return previousState;
  }

  const lateFeeItem = applicableLateFee(previousState, itemToAdd);
  if (!lateFeeItem) {
    return previousState;
  }

  const stateWithLateFeeAdded = itemAddedToCart(previousState, lateFeeItem);
  return updateObject(previousState, {
    cart: stateWithLateFeeAdded.cart,
    availableItems: stateWithLateFeeAdded.availableItems,
  });
}

const applicableLateFee = (previousState, itemToAdd) => {
  const {availableItems, tournament} = previousState;

  const lateFeeItem = availableItems.find(item => {
    if (item.category !== 'ledger' || item.determination !== 'late_fee' || item.refinement !== 'event_linked') {
      return false;
    }
    return item.configuration.event && item.configuration.event === itemToAdd.identifier;
  });

  if (!lateFeeItem) {
    return null;
  }

  // Now that we've found a matching item, are we actually in late registration?
  // 1 - if the tournament has a test environment setting
  // 2 - if the current date/time is after the item's applies_at time

  if (tournament.testing_environment) {
    // 1
    if (tournament.testing_environment.settings.registration_period.value === 'late') {
      return lateFeeItem;
    }
  } else {
    // 2
    const appliesAt = new Date(lateFeeItem.configuration.applies_at);
    const now = new Date();
    if (compareAsc(appliesAt, now) < 0) {
      return lateFeeItem;
    }
  }
}
