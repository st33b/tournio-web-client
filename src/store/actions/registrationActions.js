import * as actionTypes from './actionTypes';

export const reset = () => {
  return {
    type: actionTypes.RESET,
  }
}

export const tournamentDetailsRetrieved = (tournament) => {
  return {
    type: actionTypes.TOURNAMENT_DETAILS_RETRIEVED,
    tournament: tournament,
  }
}

export const newTeamRegistrationInitiated = () => {
  return {
    type: actionTypes.NEW_TEAM_REGISTRATION_INITIATED,
  };
}

export const teamInfoAdded = (name, shiftId) => {
  return {
    type: actionTypes.TEAM_INFO_ADDED,
    name: name,
    shiftId: shiftId,
  }
}

export const newTeamBowlerInfoAdded = (bowlerInfo) => {
  return {
    type: actionTypes.NEW_TEAM_BOWLER_INFO_ADDED,
    bowler: bowlerInfo,
  }
}

export const newTeamPartnersChosen = (bowlers) => {
  return {
    type: actionTypes.NEW_TEAM_PARTNERS_SELECTED,
    bowlers: bowlers,
  }
}

export const newTeamBowlerEdited = (bowler) => {
  return {
    type: actionTypes.NEW_TEAM_BOWLER_UPDATED,
    bowler: bowler,
  }
}

export const newTeamEntryCompleted = () => {
  return {
    type: actionTypes.NEW_TEAM_ENTRY_COMPLETED,
  }
}

export const joinTeamRegistrationInitiated = (team) => {
  return {
    type: actionTypes.JOIN_TEAM_REGISTRATION_INITIATED,
    team: team,
  }
}

export const teamListRetrieved = () => {
  return {
    type: actionTypes.TEAM_LIST_RETRIEVED,
  }
}

export const existingTeamBowlerInfoAdded = (bowlerInfo) => {
  return {
    type: actionTypes.EXISTING_TEAM_BOWLER_INFO_ADDED,
    bowler: bowlerInfo,
  }
}

export const existingTeamBowlerEdited = (bowlerInfo) => {
  return {
    type: actionTypes.EXISTING_TEAM_BOWLER_EDITED,
    bowler: bowlerInfo,
  }
}

export const submitJoinTeamCompleted = (bowlerIdentifier) => {
  return {
    type: actionTypes.SUBMIT_JOIN_TEAM_COMPLETED,
    bowlerIdentifier: bowlerIdentifier,
  }
}

export const newSoloRegistrationInitiated = () => {
  return {
    type: actionTypes.NEW_SOLO_REGISTRATION_INITIATED,
  }
}

export const soloBowlerInfoAdded = (bowlerInfo) => {
  return {
    type: actionTypes.SOLO_BOWLER_INFO_ADDED,
    bowler: bowlerInfo,
  }
}

export const soloBowlerInfoUpdated = (bowlerInfo) => {
  return {
    type: actionTypes.SOLO_BOWLER_INFO_UPDATED,
    bowler: bowlerInfo,
  }
}

export const soloBowlerRegistrationCompleted = () => {
  return {
    type: actionTypes.SOLO_BOWLER_REGISTRATION_COMPLETED,
  }
}

export const bowlerCommerceDetailsRetrieved = (bowler, availableItems) => {
  return {
    type: actionTypes.BOWLER_DETAILS_RETRIEVED,
    bowler: bowler,
    availableItems: availableItems,
  }
}

export const itemAddedToCart = (item, sizeIdentifier = null) => {
  return {
    type: actionTypes.ITEM_ADDED_TO_CART,
    item: item,
    sizeIdentifier: sizeIdentifier,
  }
}

export const itemRemovedFromCart = (item) => {
  return {
    type: actionTypes.ITEM_REMOVED_FROM_CART,
    item: item,
  }
}

export const purchaseCompleted = (newPaidPurchases) => {
  return {
    type: actionTypes.PURCHASE_COMPLETED,
    newPaidPurchases: newPaidPurchases,
  }
}

export const purchaseFailed = (error) => {
  return {
    type: actionTypes.PURCHASE_FAILED,
    error: error,
  }
}

export const freeEntryDeclared = () => {
  return {
    type: actionTypes.FREE_ENTRY_DECLARED,
  }
}

export const freeEntrySuccess = (code, message) => {
  return {
    type: actionTypes.FREE_ENTRY_SUCCESS,
    code: code,
    message: message,
  }
}

export const freeEntryFailure = (code, error) => {
  return {
    type: actionTypes.FREE_ENTRY_FAILURE,
    code: code,
    error: error
  }
}

export const newPairRegistrationInitiated = () => {
  return {
    type: actionTypes.NEW_PAIR_REGISTRATION_INITIATED,
  }
}

export const newPairBowlerAdded = (bowler) => {
  return {
    type: actionTypes.NEW_PAIR_BOWLER_INFO_ADDED,
    bowler: bowler,
  }
}

export const newPairBowlerUpdated = (bowlerInfo, index) => {
  return {
    type: actionTypes.NEW_PAIR_BOWLER_UPDATED,
    bowler: bowlerInfo,
    index: index,
  }
}

export const newPairRegistrationCompleted = () => {
  return {
    type: actionTypes.NEW_PAIR_REGISTRATION_COMPLETED,
  }
}

export const partnerUpRegistrationInitiated = (partner) => {
  return {
    type: actionTypes.PARTNER_UP_REGISTRATION_INITIATED,
    partner: partner,
  }
}

export const partnerUpBowlerAdded = (bowler) => {
  return {
    type: actionTypes.PARTNER_UP_BOWLER_INFO_ADDED,
    bowler: bowler,
  }
}

export const partnerUpBowlerUpdated = (bowlerInfo) => {
  return {
    type: actionTypes.PARTNER_UP_BOWLER_UPDATED,
    bowler: bowlerInfo,
  }
}

export const partnerUpRegistrationCompleted = () => {
  return {
    type: actionTypes.PARTNER_UP_REGISTRATION_COMPLETED,
  }
}

export const stripeCheckoutSessionInitiated = (sessionId) => {
  return {
    type: actionTypes.STRIPE_CHECKOUT_SESSION_INITIATED,
    sessionId: sessionId,
  }
}

export const stripeCheckoutSessionCompleted = () => {
  return {
    type: actionTypes.STRIPE_CHECKOUT_SESSION_COMPLETED,
  }
}
