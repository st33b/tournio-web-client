import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: new team registration initiated', () => {
  const previousState = {};
  const action = {
    type: actionTypes.NEW_SOLO_REGISTRATION_INITIATED,
  }

  it ('returns an initialized bowler', () => {
    const result = registrationReducer(previousState, action);
    expect(result.bowler).toStrictEqual({});
  });

  it ('nulls out the team', () => {
    const result = registrationReducer(previousState, action);
    expect(result.team).toBeNull();
  });

  it ('nulls out the list of bowlers', () => {
    const result = registrationReducer(previousState, action);
    expect(result.bowlers).toBeNull();
  });

  it ('nulls out the partner', () => {
    const result = registrationReducer(previousState, action);
    expect(result.partner).toBeNull();
  });
});