import * as actionTypes from './actions/actionTypes';
import {apparelSizeMapping, devConsoleLog, updateObject} from "../utils";
import {itemAddedToCart} from "./commerce/itemAddedToCart";
import {itemRemovedFromCart} from "./commerce/itemRemovedFromCart";

const initialState = {
  // tournament: null,
  // bowler: null,
  bowlerIdentifier: null,
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
    case actionTypes.COMMERCE_SESSION_INITIATED:

    case actionTypes.BOWLER_DETAILS_RETRIEVED:
      // @early-discount Kill this once we're using the other action
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
    case actionTypes.BOWLER_DETAILS_MOOTED:
      return updateObject(state, {
        tournament: null,
        bowler: null,
        cart: [],
        availableItems: {},
        availableApparelItems: {},
        purchasedItems: [],
        freeEntry: null,
      });
    case actionTypes.ITEM_ADDED_TO_CART:
      return itemAddedToCart(state, action.item, action.sizeIdentifier);
    case actionTypes.ITEM_REMOVED_FROM_CART:
      return itemRemovedFromCart(state, action.item);
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
          code: '',
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

export const extractApparelFromItems = (allItems) => {
  const nonApparelItems = {};
  const apparelItems = {};

  const itemArray = Object.values(allItems);
  const otherItems = itemArray.filter(({category, determination}) => {
    return category !== 'product' || determination !== 'apparel'
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
      determination: item.determination,
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
