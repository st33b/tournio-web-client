import * as actionTypes from './actions/actionTypes';
import {apparelSizeMapping, devConsoleLog, updateObject} from "../utils";
import {itemAddedToCart} from "./commerce/itemAddedToCart";

const initialState = {
  tournament: null,
  bowler: null,
  cart: [],
  availableItems: {},
  availableApparelItems: {},
  purchasedItems: [],
  freeEntry: null,
  checkoutSessionId: null,
  error: null,
}

export const commerceReducerInit = (initial = initialState) => initial;

export const commerceReducer = (state, action) => {
  devConsoleLog("Commerce reducer action type:", action.type);
  devConsoleLog("Commerce reducer existing state:", state);

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
      // return itemAdded(state, action.item);
      return itemAddedToCart(state, action.item, action.sizeIdentifier);
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
    apparelItems[item.identifier] = item;
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
      category: item.category,
      name: item.name,
      note: item.configuration.note,
      value: item.value,
      quantity: 0,
    });
  });

  return {
    items: nonApparelItems,
    apparelItems: apparelItems,
  };
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
