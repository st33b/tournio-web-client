import * as actionTypes from './actions/directorActionTypes'
import {devConsoleLog, updateObject} from '../utils';

const initialState = {
  user: null,
  tournaments: null,
  tournament: null,
  builder: null,

  // An argument could be made for nesting these under tournament, since they're all collection associations of
  // the tournament currently in context. But they're potentially big collections (bowlers and teams, especially),
  // and the server API doesn't actually include them in the tournament object sent back. For that reason, we
  // treat them as top-level collections.
  users: [],
  bowlers: [],
  teams: [],
  freeEntries: [],
}

export const directorReducerInit = (initial = initialState) => initial;

export const directorReducer = (state, action) => {
  devConsoleLog("Director reducer existing state:", state);
  devConsoleLog("Director reducer action:", action);

  let index, identifier;
  switch (action.type) {
    case actionTypes.LOGGED_IN:
      return updateObject(state, {
        user: {
          ...action.user,
          authToken: action.authToken,
        },
      });
    case actionTypes.LOGGED_OUT:
      return directorReducerInit();
    case actionTypes.TOURNAMENT_DETAILS_RESET:
      return updateObject(state, {
        tournament: null,
        bowlers: [],
        teams: [],
        freeEntries: [],
      });
    case actionTypes.TOURNAMENT_LIST_RESET:
      devConsoleLog("do we need to reset the tournament list?");
      return updateObject(state, {
        tournaments: null,
      });
    case actionTypes.TOURNAMENT_LIST_RETRIEVED:
      devConsoleLog("do we need to fetch the tournament list?");
      return updateObject(state, {
        tournaments: [...action.tournaments],
      });
    case actionTypes.TOURNAMENT_DETAILS_RETRIEVED:
      return updateObject(state, {
        tournament: {...action.tournament},
      });
    case actionTypes.TOURNAMENT_DELETED:
      const tournament = action.tournament.identifier === state.tournament.identifier ? null : state.tournament;
      return updateObject(state, {
        tournament: tournament,
        tournaments: state.tournaments.filter(t => t.identifier !== action.tournament.identifier),
      });
    case actionTypes.STRIPE_ACCOUNT_STATUS_CHANGED:
      return updateObject(state, {
        tournament: updateObject(state.tournament, {
          stripe_account: {...action.stripeAccount},
        }),
      });
    case actionTypes.TOURNAMENT_STATE_CHANGED:
      const newStatus = {
        state: action.newState,
        status: action.newStatus,
      }
      return updateObject(state, {
        tournament: updateObject(state.tournament, newStatus),
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
        tournament: updateObject(state.tournament, changedProperties),
      });
    case actionTypes.TOURNAMENT_CONFIG_ITEM_UPDATED:
      const property = action.configItem.key;
      const value = action.configItem.value;
      return updateObject(state, {
        tournament: updateObject(state.tournament,
          Object.defineProperty({}, property, { value: value, enumerable: true })
        ),
      });
    case actionTypes.TOURNAMENT_SHIFT_ADDED:
      return updateObject(state, {
        tournament: updateObject(state.tournament, {
          shifts: state.tournament.shifts.concat(action.shift),
        }),
      });
    case actionTypes.TOURNAMENT_SHIFT_DELETED:
      return updateObject(state, {
        tournament: updateObject(state.tournament, {
          shifts: state.tournament.shifts.filter(s => s.identifier !== action.shift.identifier)
        }),
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
        tournament: updateObject(state.tournament, {
          shifts: shifts,
        }),
      });
    case actionTypes.ADDITIONAL_QUESTIONS_UPDATED:
      return updateObject(state, {
        tournament: updateObject(state.tournament, {
          additional_questions: [...action.questions],
          available_questions: [...action.availableQuestions],
        }),
      });
    case actionTypes.TEST_DATA_CLEARED:
      const shiftChanges = state.tournament.shifts.map(shift => (
        {
          ...shift,
          requested_count: 0,
          confirmed_count: 0,
        }
      ));
      return updateObject(state, {
        tournament: updateObject(state.tournament, {
          bowler_count: 0,
          team_count: 0,
          free_entry_count: 0,
          shifts: shiftChanges,
        }),
      });
    case actionTypes.PURCHASABLE_ITEM_ADDED:
      const updatedItems = state.tournament.purchasable_items.concat(action.items);
      return updateObject(state, {
        tournament: updateObject(state.tournament, {
          purchasable_items: updatedItems,
        }),
      });
    case actionTypes.PURCHASABLE_ITEM_UPDATED:
      identifier = action.item.identifier;
      index = state.tournament.purchasable_items.findIndex(i => i.identifier === identifier);
      if (index < 0) {
        return state;
      }
      const items = [...state.tournament.purchasable_items];
      items[index] = action.item;
      return updateObject(state, {
        tournament: updateObject(state.tournament, {
          purchasable_items: items,
        }),
      });
    case actionTypes.PURCHASABLE_ITEM_DELETED:
      identifier = action.item.identifier;
      const newItems = state.tournament.purchasable_items.filter(i => i.identifier !== identifier)
      return updateObject(state, {
        tournament: updateObject(state.tournament, {
          purchasable_items: newItems,
        }),
      });
    case actionTypes.LOGO_IMAGE_UPLOADED:
      return updateObject(state, {
        tournament: updateObject(state.tournament, {
          image_url: action.imageUrl,
        }),
      });
    case actionTypes.TOURNAMENT_CONTACT_ADDED:
      return updateObject(state, {
        tournament: updateObject(state.tournament, {
          contacts: state.tournament.contacts.concat(action.contact),
        }),
      });
    case actionTypes.TOURNAMENT_CONTACT_UPDATED:
      identifier = action.contact.identifier;
      index = state.tournament.contacts.findIndex(c => c.identifier === identifier);
      const updatedContact = {
        ...state.tournament.contacts[index],
        ...action.contact,
      }
      const newContacts = [...state.tournament.contacts];
      newContacts[index] = updatedContact;
      return updateObject(state, {
        tournament: updateObject(state.tournament, {
          contacts: newContacts,
        }),
      });
    case actionTypes.USER_LIST_RETRIEVED:
      return updateObject(state, {
        users: [...action.users],
      });
    case actionTypes.USER_ADDED:
      return updateObject(state, {
        users: state.users.concat({...action.user}),
      });
    case actionTypes.USER_UPDATED:
      identifier = action.user.identifier;
      index = state.users.findIndex(u => u.identifier === identifier);
      const newUsers = [...state.users];
      newUsers[index] = {...action.user};
      return updateObject(state, {
        users: newUsers,
      });
    case actionTypes.USER_DELETED:
      identifier = action.user.identifier;
      return updateObject(state, {
        users: state.users.filter(u => u.identifier !== identifier),
      });
    case actionTypes.BOWLER_LIST_RETRIEVED:
      return updateObject(state, {
        bowlers: [...action.bowlers],
      });
    case actionTypes.BOWLER_DELETED:
      identifier = action.bowler.identifier;
      return updateObject(state, {
        tournament: {
          ...state.tournament,
          bowler_count: state.tournament.bowler_count - 1,
        },
        bowlers: state.bowlers.filter(b => b.identifier !== identifier),
      });
    case actionTypes.BOWLER_UPDATED:
      identifier = action.bowler.identifier;
      index = state.bowlers.findIndex(b => b.identifier === identifier);
      const newBowlers = [...state.bowlers];
      newBowlers[index] = {...action.bowler};
      return updateObject(state, {
        bowlers: newBowlers,
      });
    case actionTypes.BOWLER_LIST_RESET:
      return updateObject(state, {
        bowlers: [],
      });
    case actionTypes.TEAM_LIST_RETRIEVED:
      return updateObject(state, {
        teams: [...action.teams],
      });
    case actionTypes.TEAM_ADDED:
      return updateObject(state, {
        tournament: {
          ...state.tournament,
          team_count: state.tournament.team_count + 1,
        },
        teams: state.teams.concat({...action.team}),
      });
    case actionTypes.TEAM_UPDATED:
      identifier = action.team.identifier;
      index = state.teams.findIndex(t => t.identifier === identifier);
      const newTeams = [...state.teams];
      newTeams[index] = {...action.team};
      return updateObject(state, {
        teams: newTeams,
      });
    case actionTypes.TEAM_DELETED:
      identifier = action.team.identifier;
      return updateObject(state, {
        tournament: {
          ...state.tournament,
          team_count: state.tournament.team_count - 1,
        },
        teams: state.teams.filter(u => u.identifier !== identifier),
      });
    case actionTypes.TEAM_LIST_RESET:
      return updateObject(state, {
        teams: [],
      });
    case actionTypes.FREE_ENTRY_LIST_RETRIEVED:
      return updateObject(state, {
        freeEntries: [...action.freeEntries],
      });
    case actionTypes.FREE_ENTRY_ADDED:
      return updateObject(state, {
        tournament: {
          ...state.tournament,
          free_entry_count: state.tournament.free_entry_count + 1,
        },
        freeEntries: state.freeEntries.concat({...action.freeEntry}),
      });
    case actionTypes.FREE_ENTRY_UPDATED:
      identifier = action.freeEntry.identifier;
      index = state.freeEntries.findIndex(t => t.identifier === identifier);
      const newFreeEntries = [...state.freeEntries];
      newFreeEntries[index] = {...action.freeEntry};
      return updateObject(state, {
        freeEntries: newFreeEntries,
      });
    case actionTypes.FREE_ENTRY_DELETED:
      identifier = action.freeEntry.identifier;
      return updateObject(state, {
        tournament: {
          ...state.tournament,
          free_entry_count: state.tournament.free_entry_count - 1,
        },
        freeEntries: state.freeEntries.filter(u => u.identifier !== identifier),
      });
    case actionTypes.NEW_TOURNAMENT_INITIATED:
      return updateObject(state, {
        builder: {
          navigableSteps: ['name'],
          currentStep: 'name',
          tournament: null,
          saved: false,
        },
      });
    case actionTypes.NEW_TOURNAMENT_SAVED:
      return updateObject(state, {
        builder: updateObject( state.builder, {
          tournament: {...action.tournament},
          saved: true,
        })
      });
    case actionTypes.NEW_TOURNAMENT_STEP_COMPLETED:
      const newNavigableSteps = [...state.builder.navigableSteps];
      if (!newNavigableSteps.includes(action.nextStep)) {
        newNavigableSteps.push(action.nextStep);
      }
      return updateObject(state, {
        builder: updateObject(state.builder, {
          navigableSteps: newNavigableSteps,
          currentStep: action.nextStep,
        }),
      });
    case actionTypes.NEW_TOURNAMENT_PREVIOUS_STEP_CHOSEN:
      return updateObject(state, {
        builder: updateObject(state.builder, {
          currentStep: action.step,
        }),
      });
    case actionTypes.NEW_TOURNAMENT_COMPLETED:
      return updateObject(state, {
        builder: null,
        tournament: {...state.builder.tournament},
        tournaments: null,
      })
    default:
      return state;
  }
}
