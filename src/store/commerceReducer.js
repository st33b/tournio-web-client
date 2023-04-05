import {compareAsc} from "date-fns";
import * as actionTypes from './actions/actionTypes';
import {apparelSizeMapping, devConsoleLog, updateObject} from "../utils";

const initialState = {
  tournament: null,
  bowler: null,
  cart: [],
  availableItems: {},
  availableApparelItems: {}, // map the "parent" one's identifier to details. How to store sizes?
  purchasedItems: [],
  freeEntry: null,
  checkoutSessionId: null,
  error: null,
}

export const commerceReducerInit = (initial = initialState) => initial;

export const commerceReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.RESET:
      return commerceReducerInit();
    case actionTypes.TOURNAMENT_DETAILS_RETRIEVED:
      return updateObject(state, {
        tournament: action.tournament,
        error: null,
      });
    case actionTypes.BOWLER_DETAILS_RETRIEVED:
      let unpaidItems = action.bowler.unpaid_purchases.slice(0);
      // if they have a free entry--confirmed or otherwise--remove any ledger
      // items from the cart. We don't want to force them to pay an entry fee
      // while they're awaiting confirmation. And we don't want to force them
      // to wait to buy anything else if they're awaiting free entry confirmation.
      if (action.bowler.has_free_entry) {
        unpaidItems = unpaidItems.filter((element) => element.category !== 'ledger');
      }

      // Separate apparel items from the rest (ooh, maybe separate out by categories/determinations entirely...)
      const separated = extractApparelFromItems(action.availableItems);

      return updateObject(state, {
        bowler: action.bowler,
        availableItems: separated.items,
        availableApparelItems: separated.apparelItems,
        cart: unpaidItems,
        purchasedItems: action.bowler.paid_purchases,
        freeEntry: null,
        error: null,
        tournament: {...action.bowler.tournament},
      });
    case actionTypes.ITEM_ADDED_TO_CART:
      return itemAdded(state, action.item);
    case actionTypes.ITEM_REMOVED_FROM_CART:
      return itemRemoved(state, action.item);
    case actionTypes.PURCHASE_COMPLETED:
      return updateObject(state, {
          cart: [],
          purchasedItems: state.purchasedItems.concat(action.newPaidPurchases),
          availableItems: {},
          error: null,
        }
      );
    case actionTypes.PURCHASE_FAILED:
      return updateObject(state, {
        error: action.error,
      });
    case actionTypes.FREE_ENTRY_DECLARED:
      return updateObject(state, {
        freeEntry: {
          code: '',
          message: '',
          error: '',
        }
      });
    case actionTypes.FREE_ENTRY_SUCCESS:
      // Remove ledger items, so we don't force the bowler to buy an entry fee
      // when they've just indicated they have a free entry code.
      const newCart = state.cart.filter((item) => item.category !== 'ledger')
      return updateObject(state, {
        cart: newCart,
        freeEntry: {
          code: action.code,
          message: action.message,
          error: '',
        }
      });
    case actionTypes.FREE_ENTRY_FAILURE:
      return updateObject(state, {
        freeEntry: {
          code: action.code,
          message: '',
          error: action.error,
        }
      });
    case actionTypes.STRIPE_CHECKOUT_SESSION_INITIATED:
      return updateObject(state, {
        checkoutSessionId: action.sessionId,
      });
    case actionTypes.STRIPE_CHECKOUT_SESSION_COMPLETED:
      return updateObject(state, {
        checkoutSessionId: null,
        cart: [],
        bowler: null,
      });
    default:
      console.log('Haha, no', action.type);
      break;
  }
  return state;
}

const itemAdded = (state, item, sizeIdentifier) => {
  devConsoleLog("Item added:", item);
  const identifier = item.identifier;
  const cartItemIndex = state.cart.findIndex(i => i.identifier === identifier);

  // What does the resulting quantity need to be?
  let newQuantity = 1;
  if (cartItemIndex >= 0) {
    newQuantity = state.cart[cartItemIndex].quantity + 1;
  }
  const addedItem = updateObject(item, {quantity: newQuantity});
  let newCart;

  let newAvailableItems = {...state.availableItems}

  // Prevent multiple instances of things that can be bought only once
  if (item.determination === 'single_use' || item.determination === 'event' || item.category === 'sanction') {
    if (cartItemIndex >= 0) {
      // We've already got this in our cart, so we shouldn't be allowed to add it again. Bail out with no changes.
      return state;
    }

    addedItem.addedToCart = true;
    newCart = state.cart.concat(addedItem);
    newAvailableItems[identifier] = addedItem;
    markOtherItemsInDivisionUnavailable(newAvailableItems, addedItem);
  } else if (newQuantity === 1) {
    // Is it the first instance of something that can have multiples?
    newCart = state.cart.concat(addedItem);
    newAvailableItems[identifier] = addedItem;
  } else {
    // Nope, it's already in the cart, so just update it.
    // instead of adding the newly chosen item to the cart, replace it with addedItem
    newCart = state.cart.slice(0);
    newCart[cartItemIndex] = addedItem;
  }

  // Are we adding an event? Like, is this DAMIT?
  if (item.determination === 'event') {
    // Does this qualify us for a bundle discount?
    const discountItem = eligibleBundleDiscount(newAvailableItems, newCart, state.purchasedItems);
    if (discountItem) {
      // If so, add it to the cart, too.
      const intermediateState = updateObject(state, {
        cart: newCart,
        availableItems: newAvailableItems,
      });
      const stateAfterAddingDiscount = itemAdded(intermediateState, discountItem);
      newCart = stateAfterAddingDiscount.cart;
      newAvailableItems = stateAfterAddingDiscount.availableItems;
    }

    // Do we need to add a late-registration fee for the event?
    const lateFeeItem = applicableLateFee(newAvailableItems, addedItem, state.tournament);
    if (lateFeeItem) {
      // If so, add it to the cart
      const intermediateState = updateObject(state, {
        cart: newCart,
        availableItems: newAvailableItems,
      });
      const stateAfterAddingLateFee = itemAdded(intermediateState, lateFeeItem);
      newCart = stateAfterAddingLateFee.cart;
      newAvailableItems = stateAfterAddingLateFee.availableItems;
    }
  }

  // Phew, ok, that's it.
  return updateObject(state, {
    cart: newCart,
    availableItems: newAvailableItems,
  });
}

const itemRemoved = (state, item) => {
  const newQuantity = item.quantity - 1;
  const removedItem = updateObject(item, {quantity: newQuantity});
  const identifier = item.identifier;
  let newCart;

  if (newQuantity === 0) {
    newCart = state.cart.filter(i => i.identifier !== removedItem.identifier);
  } else {
    newCart = state.cart.slice(0);
    const index = newCart.findIndex(i => i.identifier === removedItem.identifier);
    newCart[index] = removedItem;
  }

  const newAvailableItems = {...state.availableItems}
  newAvailableItems[identifier] = removedItem;

  if (removedItem.determination === 'single_use' || removedItem.determination === 'event' || removedItem.category === 'sanction') {
    removedItem.addedToCart = false;
    markOtherItemsInDivisionAsAvailable(newAvailableItems, removedItem);
  }

  if (removedItem.determination === 'event') {
    // do we need to remove a bundle discount as a result?
    const discountItemIndex = newCart.findIndex(item => {
      if (item.category !== 'ledger' || item.determination !== 'bundle_discount') {
        return false;
      }
      return item.configuration.events.includes(removedItem.identifier);
    });

    if (discountItemIndex >= 0) {
      const newDiscountItem = {...newCart[discountItemIndex]};
      newDiscountItem.addedToCart = false;
      newAvailableItems[newDiscountItem.identifier] = newDiscountItem;
      newCart = newCart.filter(i => i.identifier !== newDiscountItem.identifier);
    }

    // how about an associated late fee item?
    const lateFeeItemIndex = newCart.findIndex(item => {
      if (item.category !== 'ledger' || item.determination !== 'late_fee' || item.refinement !== 'event_linked') {
        return false;
      }
      return item.configuration.event === removedItem.identifier;
    });

    if (lateFeeItemIndex >= 0) {
      const newLateFeeItem = {...newCart[lateFeeItemIndex]};
      newLateFeeItem.addedToCart = false;
      newAvailableItems[newLateFeeItem.identifier] = newLateFeeItem;
      newCart = newCart.filter(i => i.identifier !== newLateFeeItem.identifier);
    }
  }

  return updateObject(state, {
    cart: newCart,
    availableItems: newAvailableItems,
  });
}

export const extractApparelFromItems = (allItems) => {
  const nonApparelItems = {};
  const apparelItems = {};

  const itemArray = Object.values(allItems);
  const otherItems = itemArray.filter(({category, determination}) => {
    return category !== 'product' && determination !== 'apparel'
  });
  otherItems.forEach(i => nonApparelItems[i.identifier] = i);

  // Pull out the one-size-fits-all and size-parent items
  itemArray.filter(item => {
    return item.category === 'product' &&
      item.determination === 'apparel' &&
      !item.configuration.parent_identifier
  }).forEach(item => {
    // A place to put the child items' info
    if (item.refinement === 'sized') {
      item.configuration.sizes = [];
    }
    apparelItems[item.identifier] = item
  });

  // Now go through the items with a size-parent and add the size info to the parent.
  itemArray.filter(item => {
    return item.category === 'product' &&
      item.determination === 'apparel' &&
      !!item.configuration.parent_identifier
  }).forEach(item => {
    const [groupKey, sizeKey] = item.configuration.size.split('.');
    apparelItems[item.configuration.parent_identifier].configuration.sizes.push({
      identifier: item.identifier,
      size: item.configuration.size,
      displaySize: `${apparelSizeMapping[groupKey]} ${apparelSizeMapping[sizeKey]}`,
      parentIdentifier: item.configuration.parent_identifier,
      quantity: 0,
    });
  });

  return {
    items: nonApparelItems,
    apparelItems: apparelItems,
  };
}

const markOtherItemsInDivisionUnavailable = (items, addedItem) => {
  for (const identifier in items) {
    // skip if this is the added item
    if (identifier === addedItem.identifier) {
      continue;
    }
    // skip if we aren't looking at a single-use, division-based item
    if (items[identifier].determination !== 'single_use' || items[identifier].refinement !== 'division') {
      continue;
    }
    // block out other divisions in the same event
    if (items[identifier].name === addedItem.name) {
      items[identifier].addedToCart = true;
    }
  }
}

const markOtherItemsInDivisionAsAvailable = (items, removedItem) => {
  for (const identifier in items) {
    // skip if it's the removed item, since we already marked it as available
    if (identifier === removedItem.identifier) {
      continue;
    }
    // skip if we aren't looking at a single-use, division-based item
    if (items[identifier].determination !== 'single_use' || items[identifier].refinement !== 'division') {
      continue;
    }
    // mark other items with the same name as available
    if (items[identifier].name === removedItem.name) {
      items[identifier].addedToCart = false;
    }
  }
}

const eligibleBundleDiscount = (availableItems, cartItems, purchasedItems) => {
  const cartItemIdentifiers = cartItems.map(item => item.identifier);
  const purchasedItemIdentifiers = purchasedItems.map(item => item.purchasable_item_identifier);
  const itemsToConsider = cartItemIdentifiers.concat(purchasedItemIdentifiers);
  return Object.values(availableItems).find(item => {
    if (item.category !== 'ledger' || item.determination !== 'bundle_discount' || item.addedToCart) {
      return false;
    }
    // intersect the cart+purchased item identifiers with the ones in the bundle_discount's configuration.events property
    const intersection = itemsToConsider.filter(i => item.configuration.events.includes(i));

    // if the intersection is the same size as the configuration.events property, then we're eligible for the discount!
    return intersection.length === item.configuration.events.length;
  });
}

const applicableLateFee = (availableItems, addedItem, tournament) => {
  const addedItemIdentifier = addedItem.identifier;
  const lateFeeItem = Object.values(availableItems).find(item => {
    if (item.category !== 'ledger' || item.determination !== 'late_fee' || item.refinement !== 'event_linked') {
      return false;
    }
    return item.configuration.event && item.configuration.event === addedItemIdentifier;
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
