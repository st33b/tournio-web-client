import * as actionTypes from './actions/directorActionTypes'
import {devConsoleLog, updateObject} from '../utils';

const initialState = {
  tournament: null,
  builder: null,
}

export const directorReducerInit = (initial = initialState) => initial;

export const directorReducer = (state, action) => {
  let index, identifier;
  switch (action.type) {
    case actionTypes.TOURNAMENT_DETAILS_RETRIEVED:
      return updateObject(state, {
        tournament: {...action.tournament},
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
      // deprecated
    case actionTypes.ADDITIONAL_QUESTIONS_UPDATED:
      return updateObject(state, {
        tournament: updateObject(state.tournament, {
          additional_questions: [...action.questions],
          available_questions: [...action.availableQuestions],
        }),
      });
    case actionTypes.ADDITIONAL_QUESTION_ADDED:
      return updateObject(state, {
        tournament: updateObject(state.tournament, {
          additional_questions: state.tournament.additional_questions.concat(action.question),
          available_questions: state.tournament.available_questions.filter(
            ({id}) => id !== action.question.extended_form_field_id
          ),
        }),
      });
    case actionTypes.ADDITIONAL_QUESTION_UPDATED:
      identifier = action.question.identifier;
      index = state.tournament.additional_questions.findIndex(c => c.identifier === identifier);
      const updatedQuestion = {
        ...state.tournament.additional_questions[index],
        ...action.question,
      }
      const newQuestions = [...state.tournament.additional_questions];
      newQuestions[index] = updatedQuestion;
      return updateObject(state, {
        tournament: updateObject(state.tournament, {
          additional_questions: newQuestions,
        }),
      });
    case actionTypes.ADDITIONAL_QUESTION_DELETED:
      identifier = action.question.identifier;
      const newQuestionSet = state.tournament.additional_questions.filter(i => {
        return i.identifier !== identifier;
      })
      const restoredAvailableQuestion = {
        id: action.question.extended_form_field_id,
        label: action.question.label,
        name: action.question.name,
        validation_rules: action.question.validation,
      }
      return updateObject(state, {
        tournament: updateObject(state.tournament, {
          additional_questions: newQuestionSet,
          available_questions: state.tournament.available_questions.concat(restoredAvailableQuestion),
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
    case actionTypes.PURCHASABLE_ITEMS_ADDED:
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
    case actionTypes.SIZED_ITEM_UPDATED:
      return updateObject(state, {
        tournament: updateObject(state.tournament, {
          purchasable_items: replaceSizedItems(state.tournament.purchasable_items, action.sizedItem),
        })
      });
    case actionTypes.PURCHASABLE_ITEM_DELETED:
      identifier = action.item.identifier;
      const newItems = state.tournament.purchasable_items.filter(i => {
        return i.identifier !== identifier && i.configuration.parent_identifier !== identifier;
      })
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

const replaceSizedItems = (allPurchasableItems, newSizedItems) => {
  const newParentItemIndex = newSizedItems.findIndex(({refinement}) => refinement === 'sized');
  const newParentItem = newSizedItems[newParentItemIndex];
  const parentIdentifier = newParentItem.identifier;

  const purchasableItemsSansOldChildren = allPurchasableItems.filter(({configuration}) => {
    return !configuration.parent_identifier || configuration.parent_identifier !== parentIdentifier
  });

  const oldParentItemIndex = purchasableItemsSansOldChildren.findIndex(({identifier}) => identifier === parentIdentifier);
  purchasableItemsSansOldChildren[oldParentItemIndex] = newParentItem;

  const newChildItems = newSizedItems.filter(({identifier}) => identifier !== parentIdentifier);
  return purchasableItemsSansOldChildren.concat(newChildItems);
}
