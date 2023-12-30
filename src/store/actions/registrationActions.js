import * as actionTypes from './actionTypes';
import axios from "axios";
import {apiHost, devConsoleLog} from "../../utils";

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

export const newTeamRegistrationInitiated = (team) => {
  return {
    type: actionTypes.NEW_TEAM_REGISTRATION_INITIATED,
    team: team,
  };
}

export const newTeamRegistrationUpdated = (team) => {
  return {
    type: actionTypes.NEW_TEAM_REGISTRATION_UPDATED,
    team: team,
  }
}

export const newTeamBowlerInfoAdded = (bowlerInfo) => {
  return {
    type: actionTypes.NEW_TEAM_BOWLER_INFO_ADDED,
    bowler: bowlerInfo,
  }
}

export const newTeamEntryCompleted = (newTeam) => {
  return {
    type: actionTypes.NEW_TEAM_ENTRY_COMPLETED,
    team: newTeam,
  }
}

export const existingTeamBowlerInfoAdded = (bowlerInfo) => {
  return {
    type: actionTypes.NEW_TEAM_BOWLER_INFO_ADDED,
    bowler: bowlerInfo,
  }
}

export const existingTeamBowlerSaved = (teamInfo) => {
  return {
    type: actionTypes.EXISTING_TEAM_BOWLER_SAVED,
    team: teamInfo,
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

export const commerceDetailsRetrieved = ({
                                           bowler,
                                           freeEntry,
                                           purchases,
                                           automaticItems,
                                           availableItems,
                                           tournament,
                                         }) => {
  devConsoleLog("Handing commerce deets off to the reducer", {
    bowler,
    freeEntry,
    purchases,
    automaticItems,
    availableItems,
    tournament,
  });
  return {
    type: actionTypes.COMMERCE_SESSION_INITIATED,
    bowler: bowler,
    freeEntry: freeEntry,
    availableItems: availableItems,
    purchases: purchases,
    automaticItems: automaticItems,
    tournament: tournament,
  }
}

export const bowlerCommerceDetailsMooted = () => {
  return {
    type: actionTypes.BOWLER_DETAILS_MOOTED,
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
