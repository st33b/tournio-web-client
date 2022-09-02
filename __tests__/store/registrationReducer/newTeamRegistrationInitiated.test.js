import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: new team registration initiated', () => {
  const previousState = {};
  const action = {
    type: actionTypes.NEW_TEAM_REGISTRATION_INITIATED,
  }
  const expectedTeam = {
    name: '',
    bowlers: [],
    shift: null,
  };

  it ('returns an initialized team', () => {
    const result = registrationReducer(previousState, action);
    expect(result.team).toBeDefined();
    expect(result.team).toStrictEqual(expectedTeam);
  });
});