import * as actionTypes from '../../../src/store/actions/actionTypes';
import {commerceReducer} from "../../../src/store/commerceReducer";

describe ('action type: reset', () => {
  const action = {
    type: actionTypes.RESET,
  }
  const expected = {
    tournament: null,
    bowler: null,
    cart: [],
    availableItems: {},
    availableApparelItems: {},
    purchasedItems: [],
    freeEntry: null,
    checkoutSessionId: null,
    error: null,
  }

  it ('returns the expected object', () => {
    const result = commerceReducer({}, action);
    expect(result).toStrictEqual(expected);
  });
});
