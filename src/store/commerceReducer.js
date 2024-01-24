import * as actionTypes from './actions/actionTypes';
import {apparelSizeMapping, devConsoleLog, updateObject} from "../utils";
import {itemAddedToCart} from "./commerce/itemAddedToCart";
import {itemRemovedFromCart} from "./commerce/itemRemovedFromCart";

const initialState = {
  tournament: null,
  bowler: null,
  bowlerIdentifier: null,
  cart: [],
  signupables: [],
  availableItems: [],
  availableApparelItems: [],
  purchasedItems: [],
  freeEntry: null,
  checkoutSessionId: null,
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
      // Separate apparel items from the rest (ooh, maybe separate out by categories/determinations entirely...)
      const separated = extractApparelFromItems(action.availableItems);

      // Remove automatic items if there is a free entry
      let updatedCart = [];
      if (!action.freeEntry) {
        updatedCart = [...action.automaticItems];
      }

      return updateObject(state, {
        bowler: action.bowler,
        availableItems: separated.items,
        availableApparelItems: separated.apparelItems,
        signupables: action.signupables,
        cart: updatedCart,
        purchasedItems: [...action.purchases],
        freeEntry: {...action.freeEntry},
        tournament: {...action.tournament},
      });
    case actionTypes.SIGNUPABLE_STATUS_UPDATED:
      const index = state.signupables.findIndex(s => s.signupIdentifier === action.identifier);
      const updatedSignupables = [...state.signupables];
      updatedSignupables[index].signupStatus = action.status;

      // Is this a division item? If so, we need to disable signing up for the sibling items
      if (updatedSignupables[index].refinement === 'division') {
        for (let i = 0; i < updatedSignupables.length; i++) {
          if (i !== index && updatedSignupables[i].name === updatedSignupables[index].name) {
            updatedSignupables[i].disabled = action.status === 'requested';
          }
        }
      }

      return updateObject(state, {
        signupables: updatedSignupables,
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
        signupables: [],
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
  const apparelItems = [];

  const nonApparelItems = allItems.filter(({category, determination}) => {
    return category !== 'product' || determination !== 'apparel'
  });

  // Pull out the one-size-fits-all and size-parent items
  allItems.filter(item => {
    return item.category === 'product' &&
      item.determination === 'apparel' &&
      !item.configuration.parent_identifier
  }).forEach(item => {
    // A place to put the child items' info
    if (item.refinement === 'sized') {
      item.configuration.sizes = [];
    }
    apparelItems.push(item);
  });

  // Now go through the items with a size-parent and add the size info to the parent.
  allItems.filter(item => {
    return item.category === 'product' &&
      item.determination === 'apparel' &&
      !!item.configuration.parent_identifier
  }).forEach(item => {
    const [groupKey, sizeKey] = item.configuration.size.split('.');

    const index = apparelItems.findIndex(({identifier}) => identifier === item.configuration.parent_identifier);

    apparelItems[index].configuration.sizes.push({
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
