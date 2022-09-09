import * as actionTypes from './actions/directorActionTypes'
import {updateObject} from '../utils';
import {TournamentRecord} from "./records/tournament";

const initialState = {
  tournament: TournamentRecord(),
}

export const directorReducerInit = (initial = initialState) => initial;

export const directorReducer = (state, action) => {
  if (process.env.NODE_ENV === 'development') {
    // Maybe keep these, and always log reducer actions if we're in the development environment?
    console.log("Director reducer existing state:", state);
    console.log("Director reducer action:", action);
  }

  let index;
  switch (action.type) {
    case actionTypes.RESET:
      return directorReducerInit();
    case actionTypes.TOURNAMENT_DETAILS_RETRIEVED:
      return updateObject(state, {
        tournament: TournamentRecord(action.tournament),
      });
    case actionTypes.STRIPE_ACCOUNT_STATUS_CHANGED:
      const stripeAccount = state.tournament.stripe_account;
      stripeAccount.can_accept_payments = action.accountStatus.can_accept_payments;
      return updateObject(state, {
        tournament: state.tournament.set('stripe_account', stripeAccount),
      });
    case actionTypes.TOURNAMENT_STATE_CHANGED:
      const newStatus = {
        state: action.newState,
        status: action.newStatus,
      }
      return updateObject(state, {
        tournament: state.tournament.merge(newStatus),
      });
    case actionTypes.TOURNAMENT_TEST_ENVIRONMENT_UPDATED:
      const changedProperties = {
        testing_environment: {
          settings: {
            registration_period: action.newRegistrationPeriod,
          }
        }
      }
      return updateObject(state, {
        tournament: state.tournament.merge(changedProperties),
      });
    case actionTypes.TOURNAMENT_CONFIG_ITEM_UPDATED:
      const configItems = state.tournament.config_items;
      index = configItems.findIndex(i => i.id === action.configItem.id);
      configItems[index] = {...action.configItem}
      return updateObject(state, {
        tournament: state.tournament.set('config_items', configItems),
      });
    case actionTypes.TOURNAMENT_SHIFT_ADDED:
      return updateObject(state, {
        tournament: state.tournament.set('shifts', state.tournament.shifts.concat(action.shift)),
      });
    case actionTypes.TOURNAMENT_SHIFT_DELETED:
      return updateObject(state, {
        tournament: state.tournament.set('shifts', state.tournament.shifts.filter(s => s.identifier !== action.shift.identifier)),
      });
    case actionTypes.TOURNAMENT_SHIFT_UPDATED:
      const updatedShift = {...action.shift};
      const shifts = [...state.tournament.shifts]
      index = shifts.findIndex(s => s.identifier === updatedShift.identifier);
      shifts[index] = {
        ...shifts[index],
        ...updatedShift,
      }
      return updateObject(state, {
        tournament: state.tournament.set('shifts', shifts),
      })
    default:
      return state;
  }
}