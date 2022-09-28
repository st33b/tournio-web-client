import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: submit join team completed', () => {
  const previousState = {};
  const action = {
    type: actionTypes.SUBMIT_JOIN_TEAM_COMPLETED,
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