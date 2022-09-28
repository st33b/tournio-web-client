import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: new pair registration completed', () => {
  const previousState = {
    bowlers: [
      { one: 1 },
      { two: 2 },
    ],
  };
  const action = {
    type: actionTypes.NEW_PAIR_REGISTRATION_COMPLETED,
  }

  it ('nulls out the bowlers', () => {
    const result = registrationReducer(previousState, action);
    expect(result.bowlers).toBeNull();
  });
});