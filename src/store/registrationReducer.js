import * as actionTypes from './actions/actionTypes';
import {isStorageSupported, updateObject} from "../utils";

const initialState = {
  tournament: null,
  team: null,
  bowler: null,
  bowlers: null,
  partner: null,
}

export const regInitializer = (initialValue = initialState) => {
  if (isStorageSupported()) {
    return JSON.parse(localStorage.getItem('registration'));
  }
  return initialValue;
}

export const registrationReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.TOURNAMENT_DETAILS_RETRIEVED:
      return updateObject(state, {
        tournament: action.tournament,
      });
    case actionTypes.NEW_TEAM_REGISTRATION_INITIATED:
    case actionTypes.SUBMIT_JOIN_TEAM_COMPLETED:
    case actionTypes.TEAM_LIST_RETRIEVED:
      return updateObject(state, {
        team: {
          name: '',
          bowlers: [],
          shift: null,
        },
      });
    case actionTypes.JOIN_TEAM_REGISTRATION_INITIATED:
      return updateObject(state, {
        team: action.team,
      });
    case actionTypes.NEW_PAIR_REGISTRATION_INITIATED:
      return updateObject(state, {
        bowlers: [],
      });
    case actionTypes.NEW_PAIR_BOWLER_INFO_ADDED:
      const theBowler = {...action.bowler};
      theBowler.shift = state.tournament.shifts.find(s => s.identifier === action.bowler.shift);
      return updateObject(state, {
        bowlers: state.bowlers.concat(theBowler),
      });
    case actionTypes.NEW_PAIR_BOWLER_UPDATED:
      const newBowlers = [...state.bowlers];
      newBowlers[action.index] = {...state.bowlers[action.index], ...action.bowler};
      return updateObject(state, {
        bowlers: newBowlers,
      });
    case actionTypes.NEW_PAIR_REGISTRATION_COMPLETED:
      return updateObject(state, {
        bowlers: null,
      });
    case actionTypes.TEAM_INFO_ADDED:
      return updateObject(state, {
        team: {
          name: action.name,
          shift: state.tournament.shifts.find(s => s.identifier === action.shiftId),
          bowlers: [],
        }
      });
    case actionTypes.NEW_TEAM_BOWLER_INFO_ADDED:
      const newBowler = {...action.bowler}
      const newTeam = {...state.team}
      newTeam.bowlers = state.team.bowlers.concat(newBowler);
      return updateObject(state, {
        team: newTeam,
      });
    case actionTypes.NEW_TEAM_PARTNERS_SELECTED:
      const theNewTeam = {...state.team}
      theNewTeam.bowlers = [...action.bowlers];
      return updateObject(state, {
        team: theNewTeam,
      });
    case actionTypes.NEW_TEAM_BOWLER_UPDATED:
      const updatedBowlers = [...state.team.bowlers];
      const bowlerIndex = action.bowler.position - 1;
      updatedBowlers[bowlerIndex] = updateObject(state.team.bowlers[bowlerIndex], action.bowler);
      const updatedTeam = {...state.team}
      updatedTeam.bowlers = updatedBowlers;
      return updateObject(state, {
        team: updatedTeam,
      });
    case actionTypes.NEW_TEAM_ENTRY_COMPLETED:
      return updateObject(state, {
        team: null,
      });
    case actionTypes.EXISTING_TEAM_BOWLER_INFO_ADDED:
      const modifiedTeam = {...state.team}
      modifiedTeam.bowlers = state.team.bowlers.concat(action.bowler);
      return updateObject(state, {
        team: modifiedTeam,
      });
    case actionTypes.EXISTING_TEAM_BOWLER_EDITED:
      const bowlers = [...state.team.bowlers];
      bowlers.pop(); // remove the last bowler, which is the one who's been edited
      bowlers.push(action.bowler);
      const team = {...state.team}
      team.bowlers = bowlers;
      return updateObject(state,{
        team: team,
      });
    case actionTypes.NEW_SOLO_REGISTRATION_INITIATED:
      return updateObject(state, {
        bowler: {},
        team: null,
        bowlers: null,
        partner: null,
      });
    case actionTypes.SOLO_BOWLER_INFO_ADDED:
    case actionTypes.SOLO_BOWLER_INFO_UPDATED:
      const soloBowler = {...action.bowler};
      soloBowler.shift = state.tournament.shifts.find(s => s.identifier === action.bowler.shift);
      return updateObject(state, {
        bowler: soloBowler,
      });
    case actionTypes.SOLO_BOWLER_REGISTRATION_COMPLETED:
      return updateObject(state, {
        bowler: null,
      });
    case actionTypes.PARTNER_UP_REGISTRATION_INITIATED:
      const freshBowler = {};
      if (action.partner.shift) {
        freshBowler.shift = action.partner.shift;
      }
      return updateObject(state, {
        team: null,
        bowler: freshBowler,
        bowlers: null,
        partner: action.partner,
      });
    case actionTypes.PARTNER_UP_BOWLER_INFO_ADDED:
    case actionTypes.PARTNER_UP_BOWLER_UPDATED:
      return updateObject(state, {
        bowler: {...state.bowler, ...action.bowler},
      });
    case actionTypes.PARTNER_UP_REGISTRATION_COMPLETED:
      return updateObject(state, {
        bowler: null,
        partner: null,
      });
    default:
      console.log("Nope!");
      break;
  }
  return state;
}

