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

import {devConsoleLog} from "../../utils";

export const itemRemovedFromCart = (currentState, itemToRemove, sizeIdentifier = null) => {
  switch(itemToRemove.category) {
    case 'ledger':
      // It should be something event-linked: bundle discount or late fee.
      // We're removing it because it no longer applies, given the conditions
      // of the cart.
      // return handleAsLedgerItem(currentState, itemToAdd);
    case 'bowling':
      // return handleAsBowlingItem(currentState, itemToAdd);
    case 'sanction':
      // return handleAsSanctionItem(currentState, itemToAdd);
    case 'banquet':
      // return handleAsBanquetItem(currentState, itemToAdd);
    case 'product':
      // return handleAsProductItem(currentState, itemToAdd, sizeIdentifier);
    default:
      devConsoleLog("Tried to remove an unrecognized item to the cart.", itemToRemove);
      break;
  }
  return currentState;
}

const handleAsLedgerItem = (previousState, itemToRemove) => {

}

const handleAsBowlingItem = (previousState, itemToRemove) => {
  // TODO
  return previousState;
}

const handleAsSanctionItem = (previousState, itemToRemove) => {
  // TODO
  return previousState;
}

const handleAsBanquetItem = (previousState, itemToRemove) => {
  // TODO
  return previousState;
}

const handleAsProductItem = (previousState, itemToRemove) => {
  // TODO
  return previousState;
}

const handleAsSingleton = (previousState, itemToRemove) => {
  // TODO
  return previousState;
}

const handleAsPossiblyMany = (previousState, itemToRemove) => {
  // TODO
  return previousState;
}

