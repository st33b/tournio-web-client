import * as actionTypes from './actionTypes';

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
};

export const teamInfoAdded = (name, shiftId) => {
  return {
    type: actionTypes.TEAM_INFO_ADDED,
    name: name,
    shiftId: shiftId,
  }
};

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

export const joinTeamRegistrationInitiated = () => {
  return {
    type: actionTypes.JOIN_TEAM_REGISTRATION_INITIATED,
  }
}

export const teamListRetrieved = () => {
  return {
    type: actionTypes.TEAM_LIST_RETRIEVED,
  }
}

export const teamDetailsRetrieved = (team) => {
  return {
    type: actionTypes.TEAM_DETAILS_RETRIEVED,
    team: team,
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

export const bowlerCommerceDetailsRetrieved = (bowler, availableItems) => {
  return {
    type: actionTypes.BOWLER_DETAILS_RETRIEVED,
    bowler: bowler,
    availableItems: availableItems,
  }
}

export const itemAddedToCart = (item) => {
  return {
    type: actionTypes.ITEM_ADDED_TO_CART,
    item: item,
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
