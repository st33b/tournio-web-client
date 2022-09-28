import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: new pair registration initiated', () => {
  const previousState = {};
  const action = {
    type: actionTypes.NEW_PAIR_REGISTRATION_INITIATED,
  }

  it ('returns an initialized team', () => {
    const result = registrationReducer(previousState, action);
    expect(result.bowlers).toBeDefined();
    expect(result.bowlers.length).toBe(0);
  });
});