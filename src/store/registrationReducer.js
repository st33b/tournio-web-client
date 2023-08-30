import * as actionTypes from './actions/actionTypes';
import {devConsoleLog, updateObject} from "../utils";

const initialState = {
  tournament: null,
  team: null,
  bowler: null,
  bowlers: null,
  partner: null,
}

export const registrationReducerInit = (initial = initialState) => initial;

export const registrationReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.RESET:
      return registrationReducerInit();
    case actionTypes.TOURNAMENT_DETAILS_RETRIEVED:
      return updateObject(state, {
        tournament: action.tournament,
      });
    case actionTypes.NEW_TEAM_REGISTRATION_INITIATED:
      return updateObject(state, {
        team: {
          ...action.team,
          bowler: {},
        },
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
    case actionTypes.NEW_TEAM_INFO_EDITED:
      return updateObject(state, {
        team: {
          ...action.team,
        }
      });
    case actionTypes.NEW_TEAM_BOWLER_INFO_ADDED:
      return updateObject(state, {
        bowler: {...action.bowler},
      });
    case actionTypes.NEW_TEAM_PARTNERS_SELECTED:
      const theNewTeam = {...state.team}
      theNewTeam.bowlers = [...action.bowlers];
      return updateObject(state, {
        team: theNewTeam,
      });
    case actionTypes.NEW_TEAM_BOWLER_UPDATED:
      const updatedBowlers = [...state.team.bowlers];
      const bowlerIndex = action.index;
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
      devConsoleLog("DEPRECATED");
      const modifiedTeam = {...state.team}
      const bowler = {...action.bowler}
      if (modifiedTeam.bowlers.length === 0 && action.bowler.shift) {
        modifiedTeam.shift = state.tournament.shifts.find(s => s.identifier === action.bowler.shift);
        bowler.shift = modifiedTeam.shift;
      }
      modifiedTeam.bowlers = state.team.bowlers.concat(bowler);
      return updateObject(state, {
        team: modifiedTeam,
      });
    case actionTypes.EXISTING_TEAM_BOWLER_EDITED:
      devConsoleLog("DEPRECATED");
      const team = {...state.team}
      const bowlers = [...team.bowlers];
      bowlers.pop(); // remove the last bowler, which is the one who's been edited
      const updatedBowler = {...action.bowler}
      if (bowlers.length === 0 && action.bowler.shift) {
        team.shift = state.tournament.shifts.find(s => s.identifier === action.bowler.shift);
        updatedBowler.shift = team.shift;
      }
      bowlers.push(updatedBowler);
      team.bowlers = bowlers;
      return updateObject(state, {
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

