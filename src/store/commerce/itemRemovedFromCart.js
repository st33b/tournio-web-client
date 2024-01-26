// The idea is for this file to encapsulate all the logic surrounding removing
// a purchasable item from the cart, regardless of the nature of the item.

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

import {updateObject} from "../../utils";

export const itemRemovedFromCart = (currentState, itemToRemove) => {
  switch(itemToRemove.category) {
    case 'ledger':
      // It should be something event-linked: bundle discount or late fee.
      // We're removing it because it no longer applies, given the conditions
      // of the cart.
      return handleAsLedgerItem(currentState, itemToRemove);
    case 'bowling':
      return handleAsBowlingItem(currentState, itemToRemove);
    case 'sanction':
      return handleAsSanctionItem(currentState, itemToRemove);
    case 'banquet':
      return handleAsBanquetItem(currentState, itemToRemove);
    case 'raffle':
      return handleAsRaffleItem(currentState, itemToRemove);
    case 'product':
      return handleAsProductItem(currentState, itemToRemove);
    default:
      break;
  }
  return currentState;
}

const handleAsLedgerItem = (previousState, itemToRemove) => {
  if (!itemToRemove) {
    return previousState;
  }
  return handleAsSingleton(previousState, itemToRemove);
}

const handleAsBowlingItem = (previousState, itemToRemove) => {
  if (['single_use', 'event'].includes(itemToRemove.determination)) {
    return tryRemovingLateFee(
      tryRemovingBundleDiscount(
        handleAsDivisionItem(
          handleAsSingleton(
            previousState,
            itemToRemove,
            'signupables'
          ),
          itemToRemove,
          'signupables',
        ),
        itemToRemove
      ),
      itemToRemove
    );
  }
  return handleAsPossiblyMany(previousState, itemToRemove, 'signupables');
}

const handleAsSanctionItem = (previousState, itemToRemove) => {
  return handleAsSingleton(previousState, itemToRemove);
}

const handleAsBanquetItem = (previousState, itemToRemove) => {
  return handleAsPossiblyMany(previousState, itemToRemove);
}

const handleAsRaffleItem = (previousState, itemToRemove) => {
  return handleAsPossiblyMany(previousState, itemToRemove);
}

const handleAsProductItem = (previousState, itemToRemove) => {
  if (itemToRemove.refinement !== 'sized') {
    return handleAsPossiblyMany(previousState, itemToRemove);
  }

  const cartItemIndex = previousState.cart.findIndex(({identifier}) => identifier === itemToRemove.identifier);
  const newQuantity = itemToRemove.quantity - 1;

  let updatedCart;
  if (newQuantity === 0) {
    updatedCart = previousState.cart.filter(({identifier}) => identifier !== itemToRemove.identifier);
  } else {
    updatedCart = [...previousState.cart];
    updatedCart[cartItemIndex] = updateObject(itemToRemove, {
      quantity: newQuantity,
    });
  }

  return updateObject(previousState, {
    cart: updatedCart,
  });
}

const handleAsSingleton = (previousState, itemToRemove, itemSourceKey = 'availableItems') => {
  const updatedItem = {
    ...itemToRemove,
    quantity: 0,
    addedToCart: false,
  }
  const updatedCart = previousState.cart.filter(({identifier}) => {
    return identifier !== itemToRemove.identifier
  });

  const source = previousState[itemSourceKey];
  const updatedSource = [...source];
  const itemIndex = updatedSource.findIndex(({identifier}) => identifier === itemToRemove.identifier);
  updatedSource[itemIndex] = updatedItem;

  const stateChanges = {
    cart: updatedCart,
  };
  stateChanges[itemSourceKey] = updatedSource;
  return updateObject(previousState, stateChanges);
}

const handleAsPossiblyMany = (previousState, itemToRemove, itemSourceKey = 'availableItems') => {
  const lastOneStanding = itemToRemove.quantity === 1;
  const updatedItem = {
    ...itemToRemove,
    quantity: itemToRemove.quantity - 1,
    // addedToCart: !lastOneStanding,
  }

  let updatedCart;
  if (lastOneStanding) {
    // remove it from the cart
    updatedCart = previousState.cart.filter(({identifier}) => identifier !== itemToRemove.identifier);
  } else {
    // replace it with the updated one
    const itemIndex = previousState.cart.findIndex(({identifier}) => identifier === itemToRemove.identifier);
    updatedCart = [...previousState.cart];
    updatedCart[itemIndex] = updatedItem;
  }

  const source = previousState[itemSourceKey];
  const updatedSource = [...source];
  const itemIndex = updatedSource.findIndex(({identifier}) => identifier === itemToRemove.identifier);
  updatedSource[itemIndex] = updatedItem;

  const stateChanges = {
    cart: updatedCart,
  };
  stateChanges[itemSourceKey] = updatedSource;
  return updateObject(previousState, stateChanges);
}

const handleAsDivisionItem = (previousState, itemToRemove, itemSourceKey = 'availableItems') => {
  const source = previousState[itemSourceKey];
  const updatedSource = [...source];
  if (itemToRemove.refinement !== 'division') {
    return previousState;
  }

  updatedSource.forEach((item, index) => {
    // skip it if we're looking in the mirror
    // not technically necessary, but nice to call out, I guess?
    if (item.identifier === itemToRemove.identifier) {
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
    if (item.name === itemToRemove.name) {
      updatedSource[index].addedToCart = false;
    }
  });
  const stateUpdates = {};
  stateUpdates[itemSourceKey] = updatedSource;

  return updateObject(previousState, stateUpdates);
}

const tryRemovingBundleDiscount = (previousState, removedItem) => {
  const discountItem = previousState.cart.find(({determination, configuration}) => {
    if (determination !== 'bundle_discount') {
      return false;
    }
    return configuration.events.includes(removedItem.identifier);
  });

  if (typeof discountItem === 'undefined') {
    return previousState;
  }

  return handleAsLedgerItem(previousState, discountItem);
}

const tryRemovingLateFee = (previousState, removedItem) => {
  const lateFeeItem = previousState.cart.find(({determination, configuration}) => {
    if (determination !== 'late_fee') {
      return false;
    }
    return configuration.event === removedItem.identifier;
  });

  if (typeof lateFeeItem === 'undefined') {
    return previousState;
  }

  return handleAsLedgerItem(previousState, lateFeeItem);

}
