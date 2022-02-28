import * as actionTypes from './actions/actionTypes';
import {updateObject} from "../utils";
import availableItems from "../components/Commerce/AvailableItems/AvailableItems";

const initialState = {
  tournament: null,
  bowler: null,
  cart: [],
  availableItems: {},
  purchasedItems: [],
}

export const comInitializer = (initialValue = initialState) => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem('commerce'));
  }
  return initialValue;
}

export const commerceReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.TOURNAMENT_DETAILS_RETRIEVED:
      return updateObject(state, {
        tournament: action.tournament,
        bowler: null,
      });
    case actionTypes.TEAM_DETAILS_RETRIEVED:
      return updateObject(state, {
        bowler: null,
      })
    case actionTypes.BOWLER_DETAILS_RETRIEVED:
      let unpaidItems = action.bowler.unpaid_purchases.slice(0);
      // if they have a free entry--confirmed or otherwise--remove any ledger
      // items from the cart. We don't want to force them to pay an entry fee
      // while they're awaiting confirmation. And we don't want to force them
      // to wait to buy anything else if they're awaiting free entry confirmation.
      if (action.bowler.has_free_entry) {
        unpaidItems = unpaidItems.filter((element) => element.category !== 'ledger');
      }
      return updateObject(state, {
        bowler: action.bowler,
        availableItems: action.availableItems,
        cart: unpaidItems,
      });
    case actionTypes.ITEM_ADDED_TO_CART:
      return itemAdded(state, action.item);
      break;
    case actionTypes.ITEM_REMOVED_FROM_CART:
      return itemRemoved(state, action.item);
      break;
    default:
      console.log('Haha, no');
      break;
  }
}

const itemAdded = (state, item) => {
  const newQuantity = (item.quantity || 0) + 1;
  const addedItem = updateObject(item, { quantity: newQuantity });
  let newCart;

  const identifier = item.identifier;
  const newAvailableItems = { ...state.availableItems}

  if (item.determination === 'single_use') {
    addedItem.addedToCart = true;
    newCart = state.cart.concat(addedItem);
    newAvailableItems[identifier] = addedItem;
    markOtherItemsInDivisionUnavailable(newAvailableItems, addedItem);
  } else if (newQuantity === 1) {
    newCart = state.cart.concat(addedItem);
    newAvailableItems[identifier] = addedItem;
  } else {
    // instead of adding the newly chosen item to the cart, bump up its quantity
    newCart = state.cart.slice(0);
    const whichItem = newCart.find(i => i.identifier === addedItem.identifier)
    whichItem.quantity++;
  }

  return updateObject(state, {
    cart: newCart,
    availableItems: newAvailableItems,
  });
}

const itemRemoved = (state, item) => {
  const newQuantity = item.quantity - 1;
  const removedItem = updateObject(item, { quantity: newQuantity});
  const identifier = item.identifier;
  let newCart;

  if (newQuantity === 0) {
    newCart = state.cart.filter(i => i.identifier !== removedItem.identifier);
  } else {
    newCart = state.cart.slice(0);
    const reducedItem = newCart.find(i => i.identifier === removedItem.identifier);
    reducedItem.quantity--;
  }

  const newAvailableItems = { ...state.availableItems }
  newAvailableItems[identifier] = removedItem;

  if (removedItem.determination === 'single_use') {
    removedItem.addedToCart = false;
    markOtherItemsInDivisionAsAvailable(newAvailableItems, removedItem);
  }

  return updateObject(state, {
    cart: newCart,
    availableItems: newAvailableItems,
  });
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